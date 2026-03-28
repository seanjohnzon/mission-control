# WORKSPACE MAP - Crew Agent Directory
**Updated:** 2026-03-24T08:22:00Z by Franky  
**Purpose:** Cross-workspace access reference for all agents

## ACTIVE CREW WORKSPACES

| Agent | Workspace Path | Access Pattern | Status |
|-------|---------------|---------------|--------|
| Nami | `~/.openclaw/workspace/` | `../workspace/` | Main workspace |
| Brook | `~/.openclaw/workspace-brook/` | `../workspace-brook/` | Active |  
| Chopper | `~/.openclaw/workspace-chopper/` | `../workspace-chopper/` | Active |
| Franky | `~/.openclaw/workspace-franky/` | `../workspace-franky/` | Active |
| Jinbe | `~/.openclaw/workspace-jinbe/` | `../workspace-jinbe/` | Active |
| Robin | `~/.openclaw/workspace-robin/` | `../workspace-robin/` | Active |
| Sanji | `~/.openclaw/workspace-sanji/` | `../workspace-sanji/` | Active |
| Usopp | `~/.openclaw/workspace-usopp/` | `../workspace-usopp/` | Active |
| Vivi | `~/.openclaw/workspace-vivi/` | `../workspace-vivi/` | Active |
| Zeus | `~/.openclaw/workspace-zeus/` | `../workspace-zeus/` | Active |
| Zoro | `~/.openclaw/workspace-zoro/` | `../workspace-zoro/` | Active |

## HOW TO ACCESS OTHER AGENT FILES

### From Your Workspace:
```bash
# Read another agent's research
cat ../workspace-robin/memory/2026-03-24.md

# List another agent's memory files  
ls ../workspace-brook/memory/

# Access another agent's tools/config
cat ../workspace-sanji/TOOLS.md
```

### Research Collaboration Examples:
```bash
# Brook wants to read Robin's research on a topic
cd ~/.openclaw/workspace-brook
cat ../workspace-robin/memory/2026-03-23.md

# Robin wants to see Brook's creative work
cd ~/.openclaw/workspace-robin  
ls ../workspace-brook/projects/

# Nami wants to check Zeus's ops notes
cd ~/.openclaw/workspace
cat ../workspace-zeus/memory/$(date +%Y-%m-%d).md
```

## SHARED RESOURCES

All workspaces have access to:
- **Shared Memory**: `./shared-memory/` (symlinked in each workspace)
- **Crew Logs**: `./shared-memory/crew-log/`
- **Documentation**: `./shared-memory/docs/`
- **Status Updates**: `./shared-memory/status/`

## PERMISSIONS GUIDE

- **📖 Readable by All**: Research files, memory logs, project documentation
- **🔒 Private**: SOUL.md, personal configs, sensitive data
- **⚙️ Tools**: TOOLS.md files are readable but agent-specific

## CONVENTIONS

1. **Research Sharing**: Always make memory files world-readable for collaboration
2. **File References**: Use relative paths like `../workspace-{agent}/path`  
3. **Discovery**: Check shared-memory/research-index/ for latest work across agents
4. **Coordination**: Use sessions_send for handoffs, then provide file paths

---
**Built by Franky Engineering Department - SUPER infrastructure! 🔧⭐**