#!/usr/bin/env node
/**
 * projects-generator.js
 * Generates docs/data/projects.json from live Mission Control task hierarchy
 * Part of MC-LIVE-SYNC project - derives from tasks.json
 * 
 * Author: Franky (Chief Engineer)
 * Date: 2026-03-28
 */

const fs = require('fs');
const path = require('path');

// Config
const MC_API_URL = 'http://127.0.0.1:18800/api/tasks';
const OUTPUT_PATH = path.join(__dirname, '../docs/data/projects.json');

/**
 * Fetch tasks from Mission Control API
 */
async function fetchTasks() {
  try {
    const response = await fetch(MC_API_URL);
    if (!response.ok) {
      throw new Error(`MC API error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data.tasks || data; // Handle both {tasks:[]} and [] formats
  } catch (error) {
    console.error('Failed to fetch tasks from MC API:', error.message);
    process.exit(1);
  }
}

/**
 * Build child counts and relationships
 */
function buildHierarchy(tasks) {
  const parentToChildren = new Map();
  const taskById = new Map();
  
  // Index tasks by ID
  tasks.forEach(task => {
    if (task.id) {
      taskById.set(task.id, task);
    }
  });
  
  // Build parent-child relationships
  tasks.forEach(task => {
    const parent = task.parent;
    if (parent) {
      if (!parentToChildren.has(parent)) {
        parentToChildren.set(parent, []);
      }
      parentToChildren.get(parent).push(task);
    }
  });
  
  return { parentToChildren, taskById };
}

/**
 * Calculate project statistics from descendants
 */
function calculateProjectStats(projectId, hierarchy, allTasks) {
  const { parentToChildren } = hierarchy;
  
  // Get all descendants (epics, stories, tasks)
  const getAllDescendants = (parentId) => {
    const children = parentToChildren.get(parentId) || [];
    let descendants = [...children];
    
    children.forEach(child => {
      descendants = descendants.concat(getAllDescendants(child.id));
    });
    
    return descendants;
  };
  
  const descendants = getAllDescendants(projectId);
  const epics = descendants.filter(t => t.type === 'epic').map(t => t.id);
  
  // Count by status
  const openCount = descendants.filter(t => t.status === 'queued' || t.status === 'open').length;
  const inProgressCount = descendants.filter(t => t.status === 'in-progress').length;
  const blockedCount = descendants.filter(t => t.status === 'blocked').length;
  const completedCount = descendants.filter(t => t.status === 'completed').length;
  
  const storyCount = descendants.filter(t => t.type === 'story').length;
  const totalCount = descendants.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  return {
    epics,
    storyCount,
    openCount,
    inProgressCount,
    blockedCount,
    completedCount,
    progressPct,
    totalDescendants: totalCount
  };
}

/**
 * Normalize project data to match spec
 */
function normalizeProject(project, stats) {
  return {
    id: project.id || null,
    name: project.title || project.name || '',
    status: project.status || 'unknown',
    priority: project.priority || 'P2',
    owner: project.assigned || project.owner || null,
    description: project.notes || project.description || null,
    epics: stats.epics,
    storyCount: stats.storyCount,
    openCount: stats.openCount,
    inProgressCount: stats.inProgressCount,
    blockedCount: stats.blockedCount,
    completedCount: stats.completedCount,
    progressPct: stats.progressPct
  };
}

/**
 * Generate projects.json file
 */
async function generateProjectsJson() {
  console.log('🔧 SUPER! Generating projects.json from task hierarchy...');
  
  const allTasks = await fetchTasks();
  console.log(`📋 Fetched ${allTasks.length} total tasks from MC API`);
  
  // Find all projects
  const projectTasks = allTasks.filter(task => task.type === 'project');
  console.log(`🏗️ Found ${projectTasks.length} project records`);
  
  const hierarchy = buildHierarchy(allTasks);
  
  const projects = projectTasks.map(project => {
    const stats = calculateProjectStats(project.id, hierarchy, allTasks);
    return normalizeProject(project, stats);
  });
  
  const output = {
    projects: projects,
    meta: {
      generatedAt: new Date().toISOString(),
      source: 'mc-api-derived',
      projectCount: projects.length,
      generator: 'projects-generator.js',
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
  console.log(`📊 Project count: ${projects.length}`);
  projects.forEach(p => {
    console.log(`  ${p.id}: ${p.storyCount} stories, ${p.progressPct}% complete`);
  });
  console.log(`⏰ Generated at: ${output.meta.generatedAt}`);
}

// Run if called directly
if (require.main === module) {
  generateProjectsJson().catch(error => {
    console.error('❌ Generator failed:', error.message);
    process.exit(1);
  });
}

module.exports = { generateProjectsJson };