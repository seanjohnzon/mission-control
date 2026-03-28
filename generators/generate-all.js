#!/usr/bin/env node
/**
 * generate-all.js
 * Master generator script for all MC live data files
 * Part of MC-LIVE-SYNC project
 * 
 * Author: Franky (Chief Engineer)
 * Date: 2026-03-28
 */

const { generateTasksJson } = require('./tasks-generator.js');
const { generateProjectsJson } = require('./projects-generator.js');
const { generateHealthJson } = require('./health-generator.js');
const { generateCalendarJson } = require('./calendar-generator.js');
const { generateMemoryJson } = require('./memory-generator.js');

async function generateAll() {
  console.log('🔧 SUPER! Starting full data regeneration...');
  
  try {
    // Generate tasks.json (implemented)
    await generateTasksJson();
    
    // Generate projects.json (implemented)
    await generateProjectsJson();
    
    // Generate health.json (implemented)
    await generateHealthJson();
    
    // Generate calendar.json (implemented)
    await generateCalendarJson();
    
    // Generate memory.json (implemented)
    await generateMemoryJson();
    
    // TODO: Add other generators as they're built
    // etc.
    
    console.log('✅ SUPER! All data files regenerated successfully!');
  } catch (error) {
    console.error('❌ Generation failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  generateAll();
}

module.exports = { generateAll };