#!/usr/bin/env node
/**
 * tasks-generator.js
 * Generates docs/data/tasks.json from live Mission Control API
 * Part of MC-LIVE-SYNC project - replaces static snapshots with live data
 * 
 * Author: Franky (Chief Engineer)
 * Date: 2026-03-28
 */

const fs = require('fs');
const path = require('path');

// Config
const MC_API_URL = 'http://127.0.0.1:18800/api/tasks';
const OUTPUT_PATH = path.join(__dirname, '../docs/data/tasks.json');

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
 * Normalize task data to match spec requirements
 */
function normalizeTask(task) {
  // Extract numeric points from estimate strings like "3pts", "10"
  let points = null;
  if (task.points !== undefined && task.points !== null) {
    if (typeof task.points === 'number') {
      points = task.points;
    } else if (typeof task.points === 'string') {
      const match = task.points.match(/(\d+)/);
      if (match) {
        points = parseInt(match[1], 10);
      }
    }
  }

  // Normalize date fields to ISO format where possible
  function normalizeDate(dateField) {
    // Treat explicit string sentinels as null (these appear in some legacy task rows)
    if (dateField === null || dateField === undefined) return null;
    if (typeof dateField === 'string') {
      const trimmed = dateField.trim();
      if (trimmed === '' || trimmed.toLowerCase() === 'null' || trimmed.toLowerCase() === 'undefined') {
        return null;
      }
      if (trimmed.includes('T')) {
        return trimmed; // Already ISO-ish
      }
      if (trimmed.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return `${trimmed}T12:00:00.000Z`; // Convert YYYY-MM-DD to ISO
      }
      return trimmed; // Keep as clean string if unrecognized
    }
    return dateField;
  }

  // Normalize dependency field: collapse "none"/empty to null
  function normalizeDependencies(dep) {
    if (dep === null || dep === undefined) return null;
    if (typeof dep !== 'string') return dep;
    const trimmed = dep.trim();
    if (trimmed === '' || trimmed.toLowerCase() === 'none' || trimmed.toLowerCase() === 'null') {
      return null;
    }
    return trimmed;
  }

  return {
    id: task.id || null,
    title: task.title || '',
    status: task.status || 'unknown',
    priority: task.priority || 'P2',
    assigned: task.assigned || null,
    type: task.type || null,
    parent: task.parent || null,
    sprint: task.sprint || null,
    estimate: task.estimate || task.points || null,
    points: points,
    department: task.department || null,
    createdAt: normalizeDate(task.opened || task.createdAt),
    completedAt: normalizeDate(task.completed || task.completedAt),
    dependencies: normalizeDependencies(task.dependencies),
    notes: task.notes || null
  };
}

/**
 * Generate tasks.json file
 */
async function generateTasksJson() {
  console.log('🔧 SUPER! Generating tasks.json from live MC API...');
  
  const rawTasks = await fetchTasks();
  console.log(`📋 Fetched ${rawTasks.length} tasks from MC API`);

  const normalizedTasks = rawTasks.map(normalizeTask);

  const output = {
    tasks: normalizedTasks,
    meta: {
      generatedAt: new Date().toISOString(),
      source: 'mc-api',
      taskCount: normalizedTasks.length,
      generator: 'tasks-generator.js',
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
  console.log(`📊 Task count: ${normalizedTasks.length}`);
  console.log(`⏰ Generated at: ${output.meta.generatedAt}`);
}

// Run if called directly
if (require.main === module) {
  generateTasksJson().catch(error => {
    console.error('❌ Generator failed:', error.message);
    process.exit(1);
  });
}

module.exports = { generateTasksJson };