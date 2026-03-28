#!/usr/bin/env node
/**
 * health-generator.js
 * Generates docs/data/health.json from live system health checks
 * Part of MC-LIVE-SYNC project - replaces static health snapshots
 * 
 * Author: Franky (Chief Engineer)
 * Date: 2026-03-28
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Config
const OUTPUT_PATH = path.join(__dirname, '../docs/data/health.json');
const GATEWAY_HEALTH_URL = 'http://127.0.0.1:18789/health';
const OLLAMA_HOST = 'http://127.0.0.1:11434';

/**
 * Check Gateway health
 */
async function checkGateway() {
  try {
    const response = await fetch(GATEWAY_HEALTH_URL);
    if (!response.ok) {
      throw new Error(`Gateway response: ${response.status}`);
    }
    
    const healthData = await response.json();
    
    // Try to get agent count from status
    let agentCount = 0;
    try {
      const statusResponse = await fetch('http://127.0.0.1:18789/status');
      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        agentCount = statusData.agentCount || 0;
      }
    } catch (e) {
      // Agent count optional, continue
    }
    
    return {
      ok: true,
      status: healthData.status || 'live',
      agentCount: agentCount,
      url: GATEWAY_HEALTH_URL
    };
  } catch (error) {
    console.warn(`Gateway health check failed: ${error.message}`);
    return {
      ok: false,
      status: 'error',
      agentCount: 0,
      url: null
    };
  }
}

/**
 * Check Ollama health and models
 */
async function checkOllama() {
  try {
    // First check if Ollama is running
    const response = await fetch(`${OLLAMA_HOST}/api/tags`);
    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }
    
    const data = await response.json();
    const models = (data.models || []).map(model => model.name);
    
    return {
      ok: true,
      models: models,
      host: OLLAMA_HOST
    };
  } catch (error) {
    console.warn(`Ollama health check failed: ${error.message}`);
    
    // Try command line fallback
    try {
      const { stdout } = await execAsync('ollama list');
      const lines = stdout.trim().split('\n').slice(1); // Skip header
      const models = lines.map(line => line.split(/\\s+/)[0]).filter(Boolean);
      
      return {
        ok: true,
        models: models,
        host: 'localhost'
      };
    } catch (cmdError) {
      return {
        ok: false,
        models: [],
        host: null
      };
    }
  }
}

/**
 * Check disk usage
 */
async function checkDisk() {
  try {
    const { stdout } = await execAsync('df -h .');
    const lines = stdout.trim().split('\n');
    const dataLine = lines[1]; // Second line has the data
    const parts = dataLine.split(/\s+/);
    
    if (parts.length >= 5) {
      return {
        used: parts[2],
        total: parts[1],
        percent: parts[4],
        free: parts[3]
      };
    } else {
      throw new Error(`Unexpected df output format: ${parts.length} parts`);
    }
  } catch (error) {
    console.warn(`Disk health check failed: ${error.message}`);
    return {
      used: 'unknown',
      total: 'unknown',
      percent: 'unknown',
      free: 'unknown'
    };
  }
}

/**
 * Check Git freshness
 */
async function checkGit() {
  try {
    const repoPath = path.join(__dirname, '..');
    
    // Get recent commit count (last 7 days)
    const { stdout } = await execAsync(`cd "${repoPath}" && git log --since="7 days ago" --oneline | wc -l`);
    const recentCommitCount = parseInt(stdout.trim(), 10) || 0;
    
    // Get last commit timestamp
    let lastCommitAt = null;
    try {
      const { stdout: commitDate } = await execAsync(`cd "${repoPath}" && git log -1 --format="%ai"`);
      lastCommitAt = new Date(commitDate.trim()).toISOString();
    } catch (e) {
      // Optional field
    }
    
    return {
      ok: true,
      recentCommitCount: recentCommitCount,
      lastCommitAt: lastCommitAt
    };
  } catch (error) {
    console.warn(`Git health check failed: ${error.message}`);
    return {
      ok: false,
      recentCommitCount: 0,
      lastCommitAt: null
    };
  }
}

/**
 * Generate health.json file
 */
async function generateHealthJson() {
  console.log('🔧 SUPER! Generating health.json from live system checks...');
  
  // Parallel health checks for speed
  const [gateway, ollama, disk, git] = await Promise.all([
    checkGateway(),
    checkOllama(),
    checkDisk(),
    checkGit()
  ]);
  
  const output = {
    gateway,
    ollama,
    disk,
    git,
    meta: {
      generatedAt: new Date().toISOString(),
      source: 'local-runtime',
      generator: 'health-generator.js',
      generatorVersion: '1.0.0'
    }
  };

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write with pretty formatting
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf8');
  
  console.log(`✅ SUPER! Generated ${OUTPUT_PATH}`);
  console.log(`🚦 Gateway: ${gateway.ok ? 'OK' : 'FAIL'} (${gateway.agentCount} agents)`);
  console.log(`🤖 Ollama: ${ollama.ok ? 'OK' : 'FAIL'} (${ollama.models.length} models)`);
  console.log(`💾 Disk: ${disk.percent} used (${disk.used}/${disk.total})`);
  console.log(`📝 Git: ${git.recentCommitCount} recent commits`);
  console.log(`⏰ Generated at: ${output.meta.generatedAt}`);
}

// Run if called directly
if (require.main === module) {
  generateHealthJson().catch(error => {
    console.error('❌ Generator failed:', error.message);
    process.exit(1);
  });
}

module.exports = { generateHealthJson };