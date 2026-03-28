#!/usr/bin/env node
/**
 * team-org-generator.js
 * Generates docs/data/team-org.json from live org registry + task data
 * Part of MC-LIVE-SYNC project - live crew organization chart
 * 
 * Author: Franky (Chief Engineer)
 * Date: 2026-03-28
 */

const fs = require('fs');
const path = require('path');

// Config
const MC_API_URL = 'http://127.0.0.1:18800/api/tasks';
const OUTPUT_PATH = path.join(__dirname, '../docs/data/team-org.json');

/**
 * Fetch tasks from Mission Control API for workload calculation
 */
async function fetchTasks() {
  try {
    const response = await fetch(MC_API_URL);
    if (!response.ok) {
      throw new Error(`MC API error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data.tasks || data;
  } catch (error) {
    console.warn(`Failed to fetch tasks from MC API: ${error.message}`);
    return [];
  }
}

/**
 * Calculate department workload from tasks
 */
function calculateWorkload(tasks, chief) {
  const deptTasks = tasks.filter(t => 
    t.assigned && t.assigned.toLowerCase().includes(chief.toLowerCase()) &&
    (t.status === 'queued' || t.status === 'in-progress')
  );
  
  const taskCount = deptTasks.length;
  const points = deptTasks.reduce((total, task) => {
    // Extract points from estimate field
    let taskPoints = 0;
    if (task.estimate) {
      const match = String(task.estimate).match(/(\d+)/);
      if (match) {
        taskPoints = parseInt(match[1], 10);
      }
    }
    return total + taskPoints;
  }, 0);
  
  return { taskCount, points };
}

/**
 * Get department status based on current activity
 */
function getDepartmentStatus(workload, chief) {
  if (workload.taskCount === 0) {
    return 'active'; // Available but no active work
  } else if (workload.taskCount > 10) {
    return 'degraded'; // High workload
  } else {
    return 'active'; // Normal operation
  }
}

/**
 * Generate live organization data
 */
async function generateTeamOrgJson() {
  console.log('🔧 SUPER! Generating team-org.json from live org registry...');
  
  const tasks = await fetchTasks();
  console.log(`📋 Fetched ${tasks.length} tasks for workload calculation`);
  
  // Define current crew organization
  const departmentConfigs = [
    {
      id: 'navigation',
      name: 'Navigation',
      chief: 'Nami',
      model: 'claude-sonnet-4-6',
      members: ['Zeus', 'Vivi', 'Carina', 'Tangerine', 'Helm', 'Dock', 'Mikan'],
      scope: 'Orchestration, budget, crew coordination, local model monitoring',
      sessionKey: 'agent:main:main'
    },
    {
      id: 'engineering',
      name: 'Engineering',
      chief: 'Franky',
      model: 'claude-sonnet-4-6',
      members: ['Cola', 'Iceburg', 'Zeff', 'Cavendish', 'Pudding'],
      scope: 'Code, builds, deployments, infrastructure, generator automation',
      sessionKey: 'agent:franky:main'
    },
    {
      id: 'medicine',
      name: 'Medicine',
      chief: 'Chopper',
      model: 'gpt-5.4',
      members: ['Kureha', 'Doctorine', 'Hiriluk', 'Marco', 'Law'],
      scope: 'QA, health monitoring, security audits, system verification',
      sessionKey: 'agent:chopper:main'
    },
    {
      id: 'archaeology',
      name: 'Archaeology',
      chief: 'Robin',
      model: 'claude-sonnet-4-6',
      members: ['Olvia', 'Clover', 'Saul', 'Poneglyphs', 'Historia'],
      scope: 'Research, documentation, knowledge management, intake processing',
      sessionKey: 'agent:robin:main'
    },
    {
      id: 'music',
      name: 'Music',
      chief: 'Brook',
      model: 'claude-sonnet-4-6',
      members: ['Soul', 'Laboon', 'Rumbar', 'Bink', 'Tone'],
      scope: 'Creative direction, content generation, narrative design',
      sessionKey: 'agent:brook:main'
    },
    {
      id: 'swordsmanship',
      name: 'Swordsmanship',
      chief: 'Zoro',
      model: 'claude-sonnet-4-6',
      members: ['Wado', 'Sandai', 'Shusui', 'Enma', 'Asura'],
      scope: 'Security, penetration testing, threat assessment, defense',
      sessionKey: 'agent:zoro:main'
    },
    {
      id: 'cooking',
      name: 'Cooking',
      chief: 'Sanji',
      model: 'claude-sonnet-4-6',
      members: ['Zeff', 'Baratie', 'All-Blue', 'Vinsmoke', 'Germa'],
      scope: 'Deployment, CI/CD, production operations, service management',
      sessionKey: 'agent:sanji:main'
    },
    {
      id: 'helmsman',
      name: 'Helmsman',
      chief: 'Jinbe',
      model: 'claude-sonnet-4-6',
      members: ['Fishman', 'Whale', 'Current', 'Tide', 'Deep'],
      scope: 'Sprint management, task routing, workflow optimization',
      sessionKey: 'agent:jinbe:main'
    },
    {
      id: 'marksmanship',
      name: 'Marksmanship',
      chief: 'Usopp',
      model: 'claude-sonnet-4-6',
      members: ['Slingshot', 'Kabuto', 'Pop-Green', 'Sogeking', 'Brave'],
      scope: 'Specification writing, requirement gathering, story creation',
      sessionKey: 'agent:usopp:main'
    }
  ];
  
  // Build departments with live workload data
  const departments = departmentConfigs.map(config => {
    const workload = calculateWorkload(tasks, config.chief);
    const status = getDepartmentStatus(workload, config.chief);
    
    return {
      id: config.id,
      name: config.name,
      chief: config.chief,
      model: config.model,
      members: config.members,
      scope: config.scope,
      status: status,
      activeTaskCount: workload.taskCount,
      activePoints: workload.points,
      sessionKey: config.sessionKey
    };
  });
  
  // Deduplicate by taking unique entries (some departments might be duplicated in config)
  const uniqueDepartments = [];
  const seenIds = new Set();
  
  for (const dept of departments) {
    if (!seenIds.has(dept.id)) {
      seenIds.add(dept.id);
      uniqueDepartments.push(dept);
    }
  }
  
  const totalAgents = uniqueDepartments.reduce((total, dept) => total + dept.members.length, 0);
  const totalTasks = uniqueDepartments.reduce((total, dept) => total + dept.activeTaskCount, 0);
  const totalPoints = uniqueDepartments.reduce((total, dept) => total + dept.activePoints, 0);
  
  const output = {
    departments: uniqueDepartments,
    totalAgents: totalAgents,
    totalDepartments: uniqueDepartments.length,
    architecture: `Straw Hat Pirates crew model with ${uniqueDepartments.length} specialized departments. Each department led by a chief with sub-agents for specialized tasks. Current workload: ${totalTasks} active tasks (${totalPoints} points).`,
    updatedAt: new Date().toISOString(),
    meta: {
      generatedAt: new Date().toISOString(),
      source: 'org-registry+live-workload',
      generator: 'team-org-generator.js',
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
  console.log(`🏴‍☠️ Organization summary:`);
  console.log(`  Departments: ${uniqueDepartments.length}`);
  console.log(`  Total agents: ${totalAgents}`);
  console.log(`  Active workload: ${totalTasks} tasks (${totalPoints} points)`);
  
  // Show department workloads
  uniqueDepartments.forEach(dept => {
    console.log(`  ${dept.name}: ${dept.activeTaskCount} tasks (${dept.activePoints}pts) - ${dept.status}`);
  });
  
  console.log(`⏰ Generated at: ${output.meta.generatedAt}`);
}

// Run if called directly
if (require.main === module) {
  generateTeamOrgJson().catch(error => {
    console.error('❌ Generator failed:', error.message);
    process.exit(1);
  });
}

module.exports = { generateTeamOrgJson };