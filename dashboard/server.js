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

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => { try { resolve(JSON.parse(body)); } catch(e) { reject(e); } });
  });
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

const TASK_REGISTER_PATH = path.join(MC_ROOT, 'registry/tasks/TASK-REGISTER.md');

function parseTasks() {
  const raw = safeRead(TASK_REGISTER_PATH);
  const tasks = [];
  const blocks = raw.split(/^```$/m);
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i].trim();
    if (!b.startsWith('task_id:')) continue;
    const t = {};
    for (const line of b.split('\n')) {
      const m = line.match(/^([\w_]+):\s+(.+)$/);
      if (m) {
        const key = m[1].trim();
        const val = m[2].trim();
        if (key === 'task_id') t.id = val;
        else if (key === 'title') t.title = val;
        else if (key === 'status') t.status = val;
        else if (key === 'priority') t.priority = val;
        else if (key === 'phase') t.phase = val;
        else if (key === 'assigned_to') t.assigned = val;
        else if (key === 'verified_by') t.verifiedBy = val;
        else if (key === 'dependencies') t.dependencies = val;
        else if (key === 'notes') t.notes = val;
        else if (key === 'sprint') t.sprint = val;
        else if (key === 'created_at') t.createdAt = val;
        else if (key === 'completed_at') t.completedAt = val;
        else if (key === 'opened') t.opened = val;
        else if (key === 'started') t.started = val;
        else if (key === 'completed') t.completed = val;
        else if (key === 'type') t.type = val;
        else if (key === 'parent') t.parent = val;
        else if (key === 'points') t.points = val;
        else if (key === 'department') t.department = val;
        else if (key === 'dept') t.dept = val;
        else if (key === 'estimate') t.estimate = val;
        else if (key === 'actual') t.actual = val;
      }
    }
    if (t.id) tasks.push(t);
  }
  return tasks;
}

function taskToBlock(t) {
  const pad = (k, v) => `${k}:${' '.repeat(Math.max(1, 13 - k.length))}${v}`;
  const lines = [
    pad('task_id', t.task_id || t.id),
    pad('title', t.title),
    pad('status', t.status || 'open'),
    pad('priority', t.priority || 'backlog'),
    pad('phase', t.phase || ''),
    pad('assigned_to', t.assigned_to || t.assigned || 'unassigned'),
  ];
  if (t.type)          lines.push(pad('type', t.type));
  if (t.parent)        lines.push(pad('parent', t.parent));
  if (t.points !== undefined && t.points !== null && t.points !== '') lines.push(pad('points', t.points));
  if (t.department)    lines.push(pad('department', t.department));
  if (t.dept)          lines.push(pad('dept', t.dept));
  if (t.verified_by)   lines.push(pad('verified_by', t.verified_by));
  if (t.sprint)        lines.push(pad('sprint', t.sprint));
  if (t.estimate)      lines.push(pad('estimate', t.estimate));
  if (t.actual)        lines.push(pad('actual', t.actual));
  if (t.opened)        lines.push(pad('opened', t.opened));
  if (t.started)       lines.push(pad('started', t.started));
  if (t.completed)     lines.push(pad('completed', t.completed));
  if (t.created_at)    lines.push(pad('created_at', t.created_at));
  if (t.completed_at)  lines.push(pad('completed_at', t.completed_at));
  lines.push(pad('dependencies', t.dependencies || 'none'));
  lines.push(pad('notes', t.notes || ''));
  return '```\n' + lines.join('\n') + '\n```';
}

function findTaskBlock(raw, taskId) {
  const blocks = raw.split(/^```$/m);
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i].trim();
    if (!b.startsWith('task_id:')) continue;
    if (b.match(new RegExp(`^task_id:\\s+${taskId}$`, 'm'))) {
      // Return the full fenced block including backticks
      const start = raw.indexOf('```\n' + b.trimStart());
      const end = raw.indexOf('\n```', start) + 4;
      return { start, end, content: raw.slice(start, end) };
    }
  }
  return null;
}

function updateTaskBlock(blockContent, updates) {
  const lines = blockContent.replace(/^```\n/, '').replace(/\n```$/, '').split('\n');
  const updatedLines = lines.map(line => {
    const m = line.match(/^([\w_]+):(\s+)(.+)$/);
    if (!m) return line;
    const key = m[1].trim();
    const fieldMap = {
      status: 'status', title: 'title', priority: 'priority',
      phase: 'phase', assigned_to: 'assigned_to', notes: 'notes',
      sprint: 'sprint', verified_by: 'verified_by',
      dependencies: 'dependencies', completed_at: 'completed_at',
      opened: 'opened', started: 'started', completed: 'completed',
      type: 'type', parent: 'parent', points: 'points',
      department: 'department', dept: 'dept',
      estimate: 'estimate', actual: 'actual',
    };
    if (fieldMap[key] && updates[fieldMap[key]] !== undefined) {
      return `${key}:${m[2]}${updates[fieldMap[key]]}`;
    }
    return line;
  });
  // Add new fields not already present
  const presentKeys = new Set(lines.map(l => l.match(/^([\w_]+):/)?.[1]).filter(Boolean));
  const optionalFields = ['type', 'parent', 'points', 'department', 'dept', 'sprint', 'estimate', 'actual', 'verified_by', 'opened', 'started', 'completed', 'created_at', 'completed_at'];
  for (const f of optionalFields) {
    if (updates[f] !== undefined && !presentKeys.has(f)) {
      // Insert before dependencies line
      const depIdx = updatedLines.findIndex(l => l.startsWith('dependencies:'));
      const insertAt = depIdx >= 0 ? depIdx : updatedLines.length - 1;
      updatedLines.splice(insertAt, 0, `${f}:${' '.repeat(Math.max(1, 13 - f.length))}${updates[f]}`);
    }
  }
  return '```\n' + updatedLines.join('\n') + '\n```';
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

const MODEL_OPS_CACHE_MS = 30_000;
let modelOpsCache = { expiresAt: 0, data: null };

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function formatMoney(value) {
  return value === 0 ? '$0' : `$${Number(value || 0).toFixed(2)}`;
}

function shortModel(model) {
  if (!model) return '?';
  if (/gpt-5.4/i.test(model)) return 'GPT-5.4';
  if (/gpt-5.3/i.test(model)) return 'GPT-5.3';
  if (/claude-opus-4-6/i.test(model)) return 'Opus 4.6';
  if (/claude-sonnet-4-6/i.test(model)) return 'Sonnet 4.6';
  return model;
}

function loadAgentSessions(agentId) {
  try {
    const home = process.env.USERPROFILE || process.env.HOME || '';
    const p = path.join(home, '.openclaw', 'agents', agentId, 'sessions', 'sessions.json');
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function summarizeAgentSessions(agentId, sessionKeyPrefix) {
  const sessions = loadAgentSessions(agentId);
  if (!sessions) return null;
  const values = Object.entries(sessions)
    .filter(([key]) => key.startsWith(sessionKeyPrefix))
    .map(([, value]) => value || {});
  if (!values.length) return null;
  const newest = values.slice().sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))[0] || {};
  return {
    sessions: values.length,
    tokensToday: values.reduce((acc, s) => {
      acc.input += Number(s.inputTokens || 0);
      acc.output += Number(s.outputTokens || 0);
      return acc;
    }, { input: 0, output: 0 }),
    contextUsed: Number(newest.inputTokens || newest.totalTokens || newest.contextUsed || 0),
    contextWindow: Number(newest.contextTokens || newest.contextWindow || 0),
    model: newest.model || null,
    modelProvider: newest.modelProvider || null,
    updatedAt: newest.updatedAt || null,
    status: (Date.now() - Number(newest.updatedAt || 0)) < 30 * 60 * 1000 ? 'active' : 'idle'
  };
}

function mergeAgentLiveSession(agent, summary) {
  if (!agent || !summary) return;
  if (summary.tokensToday) agent.tokensToday = summary.tokensToday;
  if (typeof summary.sessions === 'number') agent.sessions = summary.sessions;
  if (summary.contextUsed) agent.contextUsed = summary.contextUsed;
  if (summary.contextWindow) agent.contextWindow = summary.contextWindow;
  if (summary.model) agent.model = summary.model;
  agent.modelShort = shortModel(agent.model);
  if (summary.updatedAt) agent.updatedAt = summary.updatedAt;
  if (summary.status) agent.status = summary.status;
}

async function fetchOllamaNames(url) {
  const data = await fetchJSON(url);
  return Array.isArray(data?.models) ? data.models.map((m) => m.name).filter(Boolean) : null;
}

async function buildLiveModelOps() {
  const defaults = JSON.parse(fs.readFileSync(path.join(MC_ROOT, 'docs/data/model-ops.json'), 'utf8'));
  const result = deepClone(defaults);
  const nowIso = new Date().toISOString();
  // Best-effort: merge live session telemetry from any locally-available agent registries.
  // (On a given host you may only have a subset of agents; missing files are fine.)
  const macModels = await fetchOllamaNames('http://127.0.0.1:11434/api/tags');
  const desktopModels = await fetchOllamaNames('http://10.0.0.251:11434/api/tags') || await fetchOllamaNames('http://127.0.0.1:11434/api/tags');
  const laptopModels = await fetchOllamaNames('http://10.0.0.16:11434/api/tags');

  for (const subscription of result.subscriptions || []) {
    for (const agent of subscription.agents || []) {
      const liveSummary = summarizeAgentSessions(agent.id, `agent:${agent.id}:`);
      mergeAgentLiveSession(agent, liveSummary);

      // Local model availability checks (best-effort).
      if (subscription.provider === 'Local / Ollama') {
        const sourceNames = agent.id === 'mikan' ? macModels : agent.id === 'cola' ? desktopModels : agent.id === 'sakura' ? laptopModels : null;
        if (Array.isArray(sourceNames)) {
          const present = sourceNames.includes(agent.model);
          agent.status = present ? 'active' : 'offline';
          agent.sessions = present ? Math.max(agent.sessions || 0, 1) : 0;
        }
      }
    }

    const subCost = (subscription.agents || []).reduce((sum, agent) => sum + Number(agent.costToday || 0), 0);
    if (subscription.type === 'local') {
      subscription.monthlyCost = 0;
      subscription.costLabel = '$0';
    } else if (subCost > 0) {
      subscription.costLabel = `today ${formatMoney(subCost)}`;
    }
  }

  result.meta = {
    ...(result.meta || {}),
    lastUpdated: nowIso,
    refreshInterval: 30,
    live: true,
    notes: [
      'Merged live Desktop session data from local .openclaw session registries for Franky/Sanji.',
      'Merged live Ollama model availability from Mac Mini/Desktop/Laptop tag endpoints when reachable.',
      'Best-effort: for each agent, if a local .openclaw agent session registry exists on this host, its sessions/tokens/model/status are merged into the schema. Missing registries simply fall back to schema defaults.'
    ]
  };

  return result;
}

async function handleModelOps() {
  if (modelOpsCache.data && modelOpsCache.expiresAt > Date.now()) return modelOpsCache.data;
  try {
    const data = await buildLiveModelOps();
    modelOpsCache = { data, expiresAt: Date.now() + MODEL_OPS_CACHE_MS };
    return data;
  } catch {
    const fallback = JSON.parse(fs.readFileSync(path.join(MC_ROOT, 'docs/data/model-ops.json'), 'utf8'));
    fallback.meta = { ...(fallback.meta || {}), lastUpdated: new Date().toISOString(), refreshInterval: 30, live: false, notes: ['Serving schema defaults because live model-ops refresh failed.'] };
    modelOpsCache = { data: fallback, expiresAt: Date.now() + MODEL_OPS_CACHE_MS };
    return fallback;
  }
}

// ---- TEAM / ORG (Dashboard Team Tab) ----
const TEAM_ORG_DEFAULT_PATH = path.join(MC_ROOT, 'docs/data/team-org.json');

function loadTeamOrgDefaults() {
  try {
    return JSON.parse(fs.readFileSync(TEAM_ORG_DEFAULT_PATH, 'utf8'));
  } catch {
    // Minimal fallback: enough for callers to render something.
    return {
      meta: { lastUpdated: new Date().toISOString(), live: false, notes: ['team-org.json missing; serving minimal fallback'] },
      nodes: [],
      edges: [],
      comms: { links: [] }
    };
  }
}

function normalizeAgentStateFromSession(summary) {
  if (!summary || !summary.updatedAt) return { status: 'offline', updatedAt: null };
  const ageMs = Date.now() - Number(summary.updatedAt || 0);
  if (!Number.isFinite(ageMs)) return { status: 'offline', updatedAt: summary.updatedAt || null };
  if (ageMs < 10 * 60 * 1000) return { status: 'online', updatedAt: summary.updatedAt };
  if (ageMs < 60 * 60 * 1000) return { status: 'idle', updatedAt: summary.updatedAt };
  return { status: 'offline', updatedAt: summary.updatedAt };
}

async function buildLiveTeamOrg() {
  const base = deepClone(loadTeamOrgDefaults());
  const nowIso = new Date().toISOString();

  // Live signals (best-effort): gateway health.
  // - localGatewayOk: gateway on THIS host (useful for local dev)
  // - remote probes: if a node has machine.ip, we can *try* to probe its gateway too
  const localGw = await fetchJSON('http://127.0.0.1:18789/health');
  const localGatewayOk = !!localGw;

  async function probeGateway(ip) {
    if (!ip) return null;
    // Keep very tight: we don't want Team tab to hang if a machine is offline.
    return await fetchJSON(`http://${ip}:18789/health`, 800);
  }

  // Map agent session summaries (if present on this host). Prefer schema-driven agentIds/sessionKeyPrefix.
  function resolveNodeSummary(node) {
    const ids = Array.isArray(node?.agentIds) ? node.agentIds.filter(Boolean) : [];
    for (const agentId of ids) {
      const prefix = node.sessionKeyPrefix || `agent:${agentId}:`;
      const s = summarizeAgentSessions(agentId, prefix);
      if (s) return s;
    }
    return null;
  }

  for (const node of base.nodes || []) {
    if (!node || !node.id) continue;

    // Best-effort live session freshness for any agent/subagent node.
    if (node.kind === 'agent' || node.kind === 'subagent') {
      const summary = resolveNodeSummary(node);
      if (summary) {
        const live = normalizeAgentStateFromSession(summary);
        if (live?.status) node.status = live.status;
        if (live?.updatedAt) node.updatedAt = live.updatedAt;
      }
    }

    // Navigation / bridge node additionally reflects gateway reachability.
    // Prefer probing the bridge machine IP (if known). Fallback to local gateway if running on the bridge host.
    if (node.id === 'bridge') {
      const bridgeSummary = resolveNodeSummary(node);
      const bridgeLive = normalizeAgentStateFromSession(bridgeSummary);

      const remoteGw = await probeGateway(node.machine?.ip);
      const bridgeGatewayOk = !!remoteGw || localGatewayOk;

      node.status = bridgeGatewayOk ? (bridgeLive.status === 'offline' ? 'online' : bridgeLive.status) : 'offline';
      node.updatedAt = bridgeLive.updatedAt;
      node.health = { ...(node.health || {}), gateway: bridgeGatewayOk ? 'ok' : 'down' };
      node.health.gatewaySource = remoteGw ? `http://${node.machine?.ip}:18789/health` : 'http://127.0.0.1:18789/health';
    }
  }

  // Communication link health.
  // Conservative: mark OpenClaw dispatch links ok if the BRIDGE gateway is reachable.
  const links = (base.comms && Array.isArray(base.comms.links)) ? base.comms.links : [];
  const bridgeNode = (base.nodes || []).find(n => n && n.id === 'bridge');
  const bridgeGatewayOk = bridgeNode?.health?.gateway === 'ok';
  const bridgeGatewaySource = bridgeNode?.health?.gatewaySource || null;

  for (const link of links) {
    if (!link || !link.id) continue;
    const channel = String(link.channel || '');
    const isDispatch = link.from === 'bridge' && /openclaw/i.test(channel);
    if (isDispatch) {
      link.ok = bridgeGatewayOk;
      link.status = bridgeGatewayOk ? 'ok' : 'unknown';
      link.lastOkAt = bridgeGatewayOk ? nowIso : (link.lastOkAt || null);
      link.notes = bridgeGatewayOk
        ? `Bridge gateway reachable (${bridgeGatewaySource || 'probe'}). Remote node reachability not yet instrumented.`
        : `Bridge gateway unreachable (${bridgeGatewaySource || 'probe'}).`;
    }
  }

  base.meta = {
    ...(base.meta || {}),
    lastUpdated: nowIso,
    live: true,
    notes: [
      'Merged best-effort gateway health: prefers probing bridge.machine.ip:18789 when available, falls back to 127.0.0.1:18789.',
      'Merged best-effort agent session freshness from local .openclaw agent session registries when present.',
      'Comms link status is currently derived from bridge gateway reachability; per-link remote probes are staged but not instrumented yet.'
    ]
  };

  return base;
}

const TEAM_CACHE_MS = 15_000;
let teamCache = { expiresAt: 0, data: null };

async function handleTeamOrg() {
  if (teamCache.data && teamCache.expiresAt > Date.now()) return teamCache.data;
  try {
    const data = await buildLiveTeamOrg();
    teamCache = { data, expiresAt: Date.now() + TEAM_CACHE_MS };
    return data;
  } catch {
    const fallback = loadTeamOrgDefaults();
    fallback.meta = { ...(fallback.meta || {}), lastUpdated: new Date().toISOString(), live: false, notes: ['Serving team-org schema defaults because live refresh failed.'] };
    teamCache = { data: fallback, expiresAt: Date.now() + TEAM_CACHE_MS };
    return fallback;
  }
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

// Calendar / Cron (Dashboard Build 2)
function getCronSchedules() {
  return [
    { id: 'hb',    name: 'Heartbeat check', cron: '*/30 * * * *', tier: 'teal', enabled: true },
    { id: 'dig',   name: 'Daily digest',    cron: '0 9 * * *',   tier: 'yellow', enabled: true },
    { id: 'maint', name: 'Maintenance',     cron: '0 2 * * 0',   tier: 'pink', enabled: true },
    { id: 'audit', name: 'Security audit',  cron: '0 3 1 * *',   tier: 'red', enabled: false },
  ];
}

function parseCronField(expr, min, max) {
  const out = new Set();
  const addRange = (a, b, step = 1) => { for (let v = a; v <= b; v += step) out.add(v); };
  const parts = (expr || '').split(',').map(s => s.trim()).filter(Boolean);

  for (const part of (parts.length ? parts : ['*'])) {
    if (part === '*') { addRange(min, max, 1); continue; }
    let m = part.match(/^\*\/(\d+)$/);
    if (m) { addRange(min, max, Math.max(1, parseInt(m[1], 10))); continue; }
    m = part.match(/^(\d+)-(\d+)(?:\/(\d+))?$/);
    if (m) {
      const a = Math.max(min, parseInt(m[1], 10));
      const b = Math.min(max, parseInt(m[2], 10));
      const step = m[3] ? Math.max(1, parseInt(m[3], 10)) : 1;
      addRange(a, b, step);
      continue;
    }
    m = part.match(/^(\d+)$/);
    if (m) {
      const v = parseInt(m[1], 10);
      if (v >= min && v <= max) out.add(v);
    }
  }

  return Array.from(out).sort((a, b) => a - b);
}

function cronOccurrencesInRange(cronExpr, rangeStart, rangeEnd) {
  const parts = (cronExpr || '').trim().split(/\s+/);
  if (parts.length < 5) return [];
  const [minField, hourField, domField, monField, dowField] = parts;

  const mins = parseCronField(minField, 0, 59);
  const hours = parseCronField(hourField, 0, 23);
  const doms = domField === '*' ? null : new Set(parseCronField(domField, 1, 31));
  const mons = monField === '*' ? null : new Set(parseCronField(monField, 1, 12));
  const dows = dowField === '*' ? null : new Set(parseCronField(dowField, 0, 6));

  const occurrences = [];
  const d0 = new Date(rangeStart);
  d0.setSeconds(0, 0);

  for (let day = new Date(d0); day < rangeEnd; day.setDate(day.getDate() + 1)) {
    const mo = day.getMonth() + 1;
    const da = day.getDate();
    const dow = day.getDay();
    if (mons && !mons.has(mo)) continue;
    if (doms && !doms.has(da)) continue;
    if (dows && !dows.has(dow)) continue;

    for (const h of hours) {
      for (const m of mins) {
        const ts = new Date(day.getFullYear(), day.getMonth(), da, h, m, 0, 0);
        if (ts >= rangeStart && ts < rangeEnd) occurrences.push(ts);
      }
    }
  }

  occurrences.sort((a, b) => a - b);
  return occurrences;
}

function getCalendarData({ start, end, view }) {
  const now = new Date();
  const rangeStart = start ? new Date(start) : new Date(now);
  const rangeEnd = end ? new Date(end) : new Date(now.getTime() + 7 * 86400000);

  const schedules = getCronSchedules();
  const cronBlocks = [];
  for (const job of schedules) {
    if (!job.enabled) continue;
    for (const ts of cronOccurrencesInRange(job.cron, rangeStart, rangeEnd)) {
      const endTs = new Date(ts.getTime() + 15 * 60000);
      cronBlocks.push({
        id: `${job.id}:${ts.toISOString()}`,
        kind: 'cron',
        title: job.name,
        start: ts.toISOString(),
        end: endTs.toISOString(),
        tier: job.tier,
        jobId: job.id,
      });
    }
  }

  const events = [
    {
      id: 'evt:demo-1',
      kind: 'event',
      title: 'Demo: Mission Control review',
      start: new Date(rangeStart.getTime() + 2 * 3600000).toISOString(),
      end: new Date(rangeStart.getTime() + 3 * 3600000).toISOString(),
      color: 'blue'
    },
    {
      id: 'rem:demo-1',
      kind: 'reminder',
      title: 'Send status update',
      start: new Date(rangeStart.getTime() + 5 * 3600000).toISOString(),
      end: new Date(rangeStart.getTime() + 5 * 3600000 + 30 * 60000).toISOString(),
      color: 'purple'
    }
  ].filter(e => new Date(e.start) < rangeEnd && new Date(e.end) > rangeStart);

  return {
    view,
    range: { start: rangeStart.toISOString(), end: rangeEnd.toISOString() },
    items: [...events, ...cronBlocks]
  };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const p = url.pathname;
  const method = req.method;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  // POST /api/tasks — create new task
  if (method === 'POST' && p === '/api/tasks') {
    try {
      const body = await parseBody(req);
      if (!body.task_id || !body.title) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'task_id and title are required' }));
        return;
      }
      body.created_at = body.created_at || new Date().toISOString().slice(0, 10);
      const block = taskToBlock(body);
      const raw = safeRead(TASK_REGISTER_PATH);
      fs.writeFileSync(TASK_REGISTER_PATH, raw.trimEnd() + '\n\n' + block + '\n');
      const tasks = parseTasks();
      const created = tasks.find(t => t.id === body.task_id);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, task: created }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // PUT /api/tasks/:id — update existing task
  const putMatch = p.match(/^\/api\/tasks\/([^/]+)$/);
  if (method === 'PUT' && putMatch) {
    try {
      const taskId = putMatch[1];
      const updates = await parseBody(req);
      const raw = safeRead(TASK_REGISTER_PATH);
      const found = findTaskBlock(raw, taskId);
      if (!found) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: `Task ${taskId} not found` }));
        return;
      }
      const newBlock = updateTaskBlock(found.content, updates);
      const newRaw = raw.slice(0, found.start) + newBlock + raw.slice(found.end);
      fs.writeFileSync(TASK_REGISTER_PATH, newRaw);
      const tasks = parseTasks();
      const updated = tasks.find(t => t.id === taskId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, task: updated }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // POST /api/tasks/:id/log — append log entry to notes
  const logMatch = p.match(/^\/api\/tasks\/([^/]+)\/log$/);
  if (method === 'POST' && logMatch) {
    try {
      const taskId = logMatch[1];
      const body = await parseBody(req);
      if (!body.message) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'message is required' }));
        return;
      }
      const raw = safeRead(TASK_REGISTER_PATH);
      const found = findTaskBlock(raw, taskId);
      if (!found) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: `Task ${taskId} not found` }));
        return;
      }
      const ts = new Date().toISOString().slice(0, 16).replace('T', ' ');
      const author = body.author || 'agent';
      const tasks = parseTasks();
      const task = tasks.find(t => t.id === taskId);
      const existingNotes = task?.notes || '';
      const newNotes = existingNotes
        ? `${existingNotes} | [${ts}] ${author}: ${body.message}`
        : `[${ts}] ${author}: ${body.message}`;
      const newBlock = updateTaskBlock(found.content, { notes: newNotes });
      const newRaw = raw.slice(0, found.start) + newBlock + raw.slice(found.end);
      fs.writeFileSync(TASK_REGISTER_PATH, newRaw);
      const updatedTasks = parseTasks();
      const updated = updatedTasks.find(t => t.id === taskId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, task: updated }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

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
  } else if (p === '/api/model-ops') {
    const data = await handleModelOps();
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
  } else if (p === '/api/team-org') {
    const data = await handleTeamOrg();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));

  } else if (p === '/api/projects') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ projects: PROJECTS }));

  } else if (p === '/api/cron-schedules') {
    const schedules = getCronSchedules();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ schedules }));

  } else if (p === '/api/calendar') {
    const start = url.searchParams.get('start');
    const end = url.searchParams.get('end');
    const view = url.searchParams.get('view') || 'week';
    const data = getCalendarData({ start, end, view });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));

  } else if (p === '/api/agents-status') {
    // Adapter endpoint: feeds MC agent state into Miniverse
    const health = await handleHealth();
    const tasks = parseTasks();
    const activeTasks = tasks.filter(t => t.status === 'in-progress' || t.status === 'active');
    const bridgeTask = activeTasks.length > 0 ? activeTasks[0].title : 'Operational';
    const agents = [
      { id: 'bridge', state: health.gateway.ok ? 'working' : 'error', task: bridgeTask, energy: health.gateway.ok ? 0.8 : 0.2 },
      { id: 'brain',  state: 'offline', task: null, energy: 0 },
      { id: 'forge',  state: 'offline', task: null, energy: 0 },
      { id: 'cihan',  state: 'idle',    task: null, energy: 1.0 },
    ];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ agents }));
  } else if (p.startsWith('/miniverse/')) {
    // Static file serving for vendored Miniverse assets
    const relPath = p.replace(/^\/miniverse\//, '');
    const filePath = path.join(__dirname, 'miniverse', relPath);
    const safePath = path.resolve(filePath);
    if (!safePath.startsWith(path.join(__dirname, 'miniverse'))) {
      res.writeHead(403); res.end('Forbidden'); return;
    }
    try {
      const data = fs.readFileSync(safePath);
      const ext = path.extname(safePath).toLowerCase();
      const mimeTypes = {
        '.html': 'text/html; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
        '.json': 'application/json; charset=utf-8',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.css': 'text/css; charset=utf-8',
        '.map': 'application/json',
      };
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      res.end(data);
    } catch {
      res.writeHead(404); res.end('Not found');
    }
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Mission Control v2 running at http://0.0.0.0:${PORT}`);
});
