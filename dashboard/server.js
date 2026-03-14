const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PORT = 18800;
const MC_ROOT = path.resolve(__dirname, '..');
const TASK_FILE = path.join(MC_ROOT, 'registry/tasks/TASK-REGISTER.md');
const COST_FILE = path.join(MC_ROOT, 'registry/routing/COST-DASHBOARD.md');

function tryExec(cmd, timeout = 5000) {
  try {
    return execSync(cmd, { timeout, encoding: 'utf8' }).trim();
  } catch (e) {
    return null;
  }
}

function tryFetch(url, timeout = 3000) {
  return new Promise(resolve => {
    const mod = url.startsWith('https') ? require('https') : require('http');
    const req = mod.get(url, { timeout }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
  });
}

async function getHealth() {
  const [gw, ollama] = await Promise.all([
    tryFetch('http://127.0.0.1:18789/health'),
    tryFetch('http://127.0.0.1:11434/api/tags')
  ]);

  const diskRaw = tryExec('df -h /');
  let disk = null;
  if (diskRaw) {
    const lines = diskRaw.split('\n');
    if (lines.length >= 2) {
      const parts = lines[1].split(/\s+/);
      disk = { size: parts[1], used: parts[2], avail: parts[3], capacity: parts[4] };
    }
  }

  const uptime = tryExec('uptime');

  return {
    timestamp: new Date().toISOString(),
    gateway: gw ? { up: gw.status === 200, status: gw.status, data: tryParseJSON(gw.data) } : { up: false },
    ollama: ollama ? { up: ollama.status === 200, status: ollama.status, data: tryParseJSON(ollama.data) } : { up: false },
    disk,
    uptime
  };
}

function tryParseJSON(s) {
  try { return JSON.parse(s); } catch { return s; }
}

function parseTasks() {
  let content;
  try { content = fs.readFileSync(TASK_FILE, 'utf8'); } catch { return { error: 'File not found' }; }

  const blocks = content.match(/```[\s\S]*?```/g) || [];
  const tasks = [];

  for (const block of blocks) {
    const inner = block.replace(/^```\s*/, '').replace(/\s*```$/, '');
    const task = {};
    for (const line of inner.split('\n')) {
      const m = line.match(/^(\w[\w_]*):\s+(.+)$/);
      if (m) task[m[1].trim()] = m[2].trim();
    }
    if (task.task_id) tasks.push(task);
  }

  const active = tasks.filter(t => t.status === 'in-progress');
  const blocked = tasks.filter(t => t.status === 'blocked');
  const open = tasks.filter(t => t.status === 'open');
  const completed = tasks.filter(t => t.status === 'completed');
  const cancelled = tasks.filter(t => t.status === 'cancelled');

  return { tasks, summary: { active: active.length, blocked: blocked.length, open: open.length, completed: completed.length, cancelled: cancelled.length }, active, blocked, open, completed };
}

function parseRouting() {
  let content;
  try { content = fs.readFileSync(COST_FILE, 'utf8'); } catch { return { error: 'File not found' }; }

  // Extract today's cost
  const costMatch = content.match(/\*\*Total estimated cost\*\*\s*\|\s*\*\*([^*]+)\*\*/);
  const localUtilMatch = content.match(/Local utilization rate\s*\|\s*\*\*([^*]+)\*\*/);
  const projCloudMatch = content.match(/### Current Trajectory[\s\S]*?\*\*Total projected\*\*\s*\|\s*\*\*([^*]+)\*\*/);
  const projLocalMatch = content.match(/### Target Trajectory[\s\S]*?\*\*Total projected\*\*\s*\|\s*\*\*([^*]+)\*\*/);
  const savingsMatch = content.match(/Estimated Monthly Savings[^*]*\*\*([^*]+)\*\*/);

  // Parse 7-day trend table — search entire content for date rows
  const trendData = [];
  const trendRows = content.match(/\| 2\d{3}-\d{2}-\d{2}\s*\|[^\n]+/g) || [];
  for (const row of trendRows) {
    const cols = row.split('|').map(c => c.trim()).filter(Boolean);
    if (cols.length >= 5 && cols[0].match(/^\d{4}-\d{2}-\d{2}$/)) {
      trendData.push({ date: cols[0], cloud: cols[1], local: cols[2], perplexity: cols[3], total: cols[4] });
    }
  }

  // Parse alerts
  const alerts = [];
  const alertSection = content.match(/## Alerts[\s\S]*?(?=\n## |$)/);
  if (alertSection) {
    const alertLines = alertSection[0].match(/- [🔴🟡🟢].+/g) || [];
    alerts.push(...alertLines.map(l => l.replace(/^- /, '')));
  }

  // Parse routing compliance
  const compliance = [];
  const compSection = content.match(/## Routing Compliance[\s\S]*?(?=\n## |$)/);
  if (compSection) {
    const compRows = compSection[0].match(/\| .+→.+\|.+\|.+\|/g) || [];
    for (const row of compRows) {
      const cols = row.split('|').map(c => c.trim()).filter(Boolean);
      if (cols.length >= 3) compliance.push({ check: cols[0], status: cols[1], action: cols[2] });
    }
  }

  return {
    todayCost: costMatch ? costMatch[1] : 'N/A',
    localUtilization: localUtilMatch ? localUtilMatch[1] : 'N/A',
    projectedCloud: projCloudMatch ? projCloudMatch[1] : 'N/A',
    projectedLocal: projLocalMatch ? projLocalMatch[1] : 'N/A',
    estimatedSavings: savingsMatch ? savingsMatch[1] : 'N/A',
    trend: trendData,
    alerts,
    compliance
  };
}

function getActivity() {
  const gitLog = tryExec(`git -C "${MC_ROOT}" log --oneline -10 --format="%h %s (%ar)"`);
  const commits = gitLog ? gitLog.split('\n').filter(Boolean) : [];

  // Check for heartbeat/digest timestamps
  let lastHeartbeat = null;
  let lastDigest = null;
  try {
    const memDir = path.join(MC_ROOT, '..', '.openclaw', 'workspace', 'memory');
    if (fs.existsSync(path.join(memDir, 'heartbeat-state.json'))) {
      const hb = JSON.parse(fs.readFileSync(path.join(memDir, 'heartbeat-state.json'), 'utf8'));
      lastHeartbeat = hb.lastChecks ? JSON.stringify(hb.lastChecks) : null;
    }
  } catch {}

  return {
    timestamp: new Date().toISOString(),
    commits,
    lastHeartbeat,
    lastDigest
  };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);

  if (url.pathname === '/' || url.pathname === '/index.html') {
    try {
      const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    } catch (e) {
      res.writeHead(500); res.end('index.html not found');
    }
    return;
  }

  if (url.pathname === '/api/health') {
    const data = await getHealth();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
    return;
  }

  if (url.pathname === '/api/tasks') {
    const data = parseTasks();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
    return;
  }

  if (url.pathname === '/api/routing') {
    const data = parseRouting();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
    return;
  }

  if (url.pathname === '/api/activity') {
    const data = getActivity();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Mission Control dashboard running at http://127.0.0.1:${PORT}`);
});
