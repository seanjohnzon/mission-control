import { useState, useEffect, useRef } from 'react';
import { CREW } from './crewConfig';

const POLL_INTERVAL = 10000;

async function fetchAgentStatus(agent) {
  const base = `http://${agent.ip}:${agent.port}`;
  const headers = { Authorization: `Bearer ${agent.token}` };

  try {
    const healthRes = await fetch(`${base}/health`, { headers, signal: AbortSignal.timeout(5000) });
    if (!healthRes.ok) return { name: agent.name, state: 'offline', model: null, outputTokens: 0, lastActive: null };

    let state = 'idle';
    let model = null;
    let outputTokens = 0;
    let lastActive = null;

    try {
      const sessRes = await fetch(`${base}/api/sessions/list`, { headers, signal: AbortSignal.timeout(5000) });
      if (sessRes.ok) {
        const data = await sessRes.json();
        const sessions = data.sessions || data || [];
        const recent = Array.isArray(sessions) ? sessions[0] : null;
        if (recent) {
          const age = recent.age ?? (Date.now() - (recent.lastActiveAt || 0));
          model = recent.model || null;
          outputTokens = recent.outputTokens || 0;
          lastActive = recent.lastActiveAt || null;
          if (age < 30000 && outputTokens > 0) state = 'working';
          else if (age < 30000 && outputTokens === 0) state = 'thinking';
        }
      }
    } catch (_) {
      // sessions fetch failed ??? still online, just idle
    }

    return { name: agent.name, state, model, outputTokens, lastActive };
  } catch (_) {
    return { name: agent.name, state: 'offline', model: null, outputTokens: 0, lastActive: null };
  }
}

export default function useGatewayStatus() {
  const [statuses, setStatuses] = useState(() =>
    CREW.map((a) => ({ name: a.name, state: 'idle', model: null, outputTokens: 0, lastActive: null }))
  );
  const timerRef = useRef(null);

  async function poll() {
    const results = await Promise.all(CREW.map(fetchAgentStatus));
    setStatuses(results);
  }

  useEffect(() => {
    poll();
    timerRef.current = setInterval(poll, POLL_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, []);

  return statuses;
}
