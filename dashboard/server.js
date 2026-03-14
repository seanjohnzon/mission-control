const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PORT = 18800;
const MC_ROOT = path.resolve(__dirname, '..');
const WORKSPACE = '/Users/minicihan/.openclaw/workspace';

function safeRead(p) {
  try { return fs.readFileSync(p, 'utf8'); } catch { return ''; }
}

function safeJSON(fn) {
  try { return fn(); } catch (e) { return { error: e.message }; }
}

async function fetchJSON(url, timeout = 3000) {
  return new Promise((resolve) => {
    const mod = url.startsWith('https') ? require('https') : require('http');
    const req = mod.get(url, { timeout }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve(JSON.parse(d)); } catch { resolve({ raw: d }); }
      });
    });
    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
  });
}

function parseTasks() {
  const raw = safeRead(path.join(MC_ROOT, 'registry/tasks/TASK-REGISTER.md'));
  const tasks = [];
  const blocks = raw.split(/^```$/m);
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i].trim();
    if (!b.startsWith('task_id:')) continue;
    const t = {};
    for (const line of b.split('\n')) {
      const m = line.match(/^(\w+):\s+(.+)$/);
      if (m) {
        const key = m[1].trim();
        const val = m[2].trim();
        if (key === 'task_id') t.id = val;
        else if (key === 'title') t.title = val;
        else if (key === 'status') t.status = val;
        else if (key === 'priority') t.priority = val;
        else if (key === 'phase') t.phase = val;
        else if (key === 'assigned_to') t.assigned = val;
        else if (key === 'dependencies') t.dependencies = val;
        else if (key === 'notes') t.notes = val;
      }
    }
    if (t.id) tasks.push(t);
  }
  return tasks;
}

function parseRouting() {
  const cost = safeRead(path.join(MC_ROOT, 'registry/routing/COST-DASHBOARD.md'));
  const audit = safeRead(path.join(MC_ROOT, 'registry/routing/ROUTING-AUDIT.md'));

  // Parse today cost
  let todayCost = '$0.00';
  const costMatch = cost.match(/\*\*Total estimated cost\*\*\s*\|\s*\*\*([^*]+)\*\*/);
  if (costMatch) todayCost = costMatch[1].trim();

  // Parse local utilization
  let localUtilization = '0%';
  const localMatch = cost.match(/Local utilization rate\s*\|\s*\*\*([^*]+)\*\*/);
  if (localMatch) localUtilization = localMatch[1].trim();

  // Parse 7-day trend
  const trend = [];
  const trendSection = cost.split('## 7-Day Trend')[1];
  if (trendSection) {
    const rows = trendSection.split('\n').filter(l => l.match(/^\|\s*2026-/));
    for (const row of rows) {
      const cols = row.split('|').map(c => c.trim()).filter(Boolean);
      if (cols.length >= 5) {
        trend.push({ date: cols[0], cloud: cols[1], local: cols[2], perplexity: cols[3], total: cols[4] });
      }
    }
  }

  // Parse guardrails from audit
  const guardrails = [];
  const guardrailNames = ['heartbeat', 'digest', 'hygiene', 'summaries', 'maintenance'];
  for (const name of guardrailNames) {
    const hasPass = audit.toLowerCase().includes(name) && audit.includes('✅');
    guardrails.push({ name, status: 'fail', evidence: 'See ROUTING-AUDIT.md' });
  }

  // Parse monthly projection
  let projectedCloud = '$20-82';
  const projMatch = cost.match(/\*\*Total projected\*\*\s*\|\s*\*\*([^*]+)\*\*/);
  if (projMatch) projectedCloud = projMatch[1].trim();

  return {
    todayCost,
    localUtilization,
    projectedCloud,
    projectedLocal: '$3-15',
    estimatedSavings: '$17-67/mo',
    trend,
    guardrails,
    auditSummary: audit.split('## 2.')[0] || ''
  };
}

function parseMemoryDaily() {
  const memDir = path.join(WORKSPACE, 'memory');
  const daily = [];
  try {
    const files = fs.readdirSync(memDir).filter(f => f.endsWith('.md')).sort().reverse();
    for (const f of files) {
      const content = safeRead(path.join(memDir, f));
      const date = f.replace('.md', '');
      daily.push({ date, content });
    }
  } catch {}
  return { daily };
}

function parseMemoryLong() {
  const raw = safeRead(path.join(WORKSPACE, 'MEMORY.md'));
  const sections = [];
  if (!raw) return { sections };
  const parts = raw.split(/^## /m);
  for (const part of parts.slice(1)) {
    const lines = part.split('\n');
    const title = lines[0].trim();
    const content = lines.slice(1).join('\n').trim();
    sections.push({ title, content });
  }
  return { sections };
}

function parseDocs() {
  const docsDir = path.join(MC_ROOT, 'docs');
  const docs = [];
  try {
    const files = fs.readdirSync(docsDir).filter(f => f.endsWith('.md')).sort();
    for (const f of files) {
      const fp = path.join(docsDir, f);
      const content = safeRead(fp);
      const stat = fs.statSync(fp);
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : f;
      let group = 'Other';
      if (f.startsWith('D1.')) group = 'D1.x — Organization';
      else if (f.startsWith('D2.')) group = 'D2.x — Runbooks';
      else if (f.startsWith('D5.')) group = 'D5.x — Improvement';
      docs.push({ filename: f, title, group, lastModified: stat.mtime.toISOString(), content });
    }
  } catch {}
  return { docs };
}

async function handleHealth() {
  const [gw, ollama] = await Promise.all([
    fetchJSON('http://127.0.0.1:18789/health'),
    fetchJSON('http://127.0.0.1:11434/api/tags')
  ]);

  let disk = { total: '?', used: '?', free: '?', percent: '?' };
  try {
    const df = execSync('df -h /').toString();
    const lines = df.trim().split('\n');
    if (lines.length > 1) {
      const parts = lines[1].split(/\s+/);
      disk = { total: parts[1], used: parts[2], free: parts[3], percent: parts[4] };
    }
  } catch {}

  return {
    gateway: { ok: !!gw, status: gw ? 'healthy' : 'unreachable' },
    ollama: { ok: !!(ollama && ollama.models), models: ollama?.models?.map(m => m.name) || [] },
    disk
  };
}

function handleActivity() {
  let commits = [];
  try {
    const log = execSync(`git -C "${MC_ROOT}" log --oneline -10 2>/dev/null`).toString();
    commits = log.trim().split('\n').filter(Boolean).map(l => {
      const [hash, ...rest] = l.split(' ');
      return { hash, message: rest.join(' ') };
    });
  } catch {}
  return { commits, lastHeartbeat: null, lastDigest: null };
}

const PROJECTS = [
  { name: 'Mission Control', desc: 'Operational dashboard and governance system', status: 'active', phase: 'Phase 1', progress: 60 },
  { name: 'Bridge Runtime', desc: 'OpenClaw autonomous agent on Mac Mini', status: 'active', phase: 'Operational', progress: 90 },
  { name: 'Telegram Integration', desc: '@CihanHawkBot ops-channel', status: 'active', phase: 'Connected', progress: 100 },
  { name: 'Discord Integration', desc: 'Community/team channel', status: 'planned', phase: 'Awaiting decision (TASK-010)', progress: 0 },
  { name: 'One Piece', desc: '(placeholder project)', status: 'planned', phase: '', progress: 0 },
  { name: 'Local Inference', desc: 'Ollama qwen2.5 on Mac Mini', status: 'active', phase: '2 models installed', progress: 75 },
  { name: 'Desktop Integration', desc: 'Brain agent on Desktop machine', status: 'planned', phase: 'Blocked (TASK-011)', progress: 0 }
];

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const p = url.pathname;

  res.setHeader('Access-Control-Allow-Origin', '*');

  if (p === '/' || p === '/index.html') {
    const html = safeRead(path.join(__dirname, 'index.html'));
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  } else if (p === '/api/health') {
    const data = await handleHealth();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  } else if (p === '/api/tasks') {
    const tasks = parseTasks();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ tasks }));
  } else if (p === '/api/routing') {
    const data = parseRouting();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  } else if (p === '/api/activity') {
    const data = handleActivity();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  } else if (p === '/api/memory') {
    const data = parseMemoryDaily();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  } else if (p === '/api/memory-long') {
    const data = parseMemoryLong();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  } else if (p === '/api/docs') {
    const data = parseDocs();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  } else if (p === '/api/projects') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ projects: PROJECTS }));
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Mission Control v2 running at http://127.0.0.1:${PORT}`);
});
