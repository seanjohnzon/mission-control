#!/usr/bin/env node
/**
 * calendar-generator.js
 * Generates docs/data/calendar.json from cron schedules + board events
 * Part of MC-LIVE-SYNC project - merges scheduling sources
 * 
 * Author: Franky (Chief Engineer)
 * Date: 2026-03-28
 */

const fs = require('fs');
const path = require('path');

// Config
const MC_API_URL = 'http://127.0.0.1:18800/api/tasks';
const OUTPUT_PATH = path.join(__dirname, '../docs/data/calendar.json');

/**
 * Fetch tasks from Mission Control API (for due dates/reminders)
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
 * Generate cron schedule entries
 */
function generateCronEntries() {
  const baseDate = new Date();
  const entries = [];
  
  // Current crew cron schedules based on existing data
  const cronSchedules = [
    {
      title: "Daily Standup (Zeus)",
      time: "09:00",
      recurrence: "daily",
      agent: "Zeus",
      tier: "teal"
    },
    {
      title: "Jinbe Board Cleanup", 
      time: "08:30",
      recurrence: "daily",
      agent: "Jinbe",
      tier: "yellow"
    },
    {
      title: "Daily Cost Report (Zeus)",
      time: "20:00", 
      recurrence: "daily",
      agent: "Zeus",
      tier: "teal"
    },
    {
      title: "Sprint Review (Zeus)",
      time: "17:00",
      recurrence: "weekly-fri",
      agent: "Zeus", 
      tier: "pink"
    },
    {
      title: "Session Bloat Cleanup",
      time: "04:00",
      recurrence: "daily", 
      agent: "Nami",
      tier: "yellow"
    },
    {
      title: "Franky Heartbeat",
      time: "every 15min",
      recurrence: "continuous",
      agent: "Franky",
      tier: "red"
    },
    {
      title: "Jinbe Heartbeat", 
      time: "every 30min",
      recurrence: "continuous",
      agent: "Jinbe",
      tier: "red"
    },
    {
      title: "Nami Heartbeat",
      time: "every 1h",
      recurrence: "continuous", 
      agent: "Nami",
      tier: "red"
    }
  ];
  
  cronSchedules.forEach((schedule, index) => {
    let start, end = null;
    
    if (schedule.recurrence === 'continuous') {
      // For continuous items, show next occurrence
      start = new Date(baseDate);
      start.setMinutes(0, 0, 0); // Round to hour
    } else if (schedule.recurrence === 'daily') {
      // Today's occurrence
      start = new Date(baseDate);
      const [hours, minutes] = schedule.time.split(':').map(Number);
      start.setHours(hours, minutes, 0, 0);
      
      // If already past, show tomorrow's
      if (start < baseDate) {
        start.setDate(start.getDate() + 1);
      }
    } else if (schedule.recurrence === 'weekly-fri') {
      // Next Friday occurrence
      start = new Date(baseDate);
      const [hours, minutes] = schedule.time.split(':').map(Number);
      start.setHours(hours, minutes, 0, 0);
      
      // Find next Friday (day 5)
      const daysUntilFriday = (5 - start.getDay() + 7) % 7;
      if (daysUntilFriday === 0 && start < baseDate) {
        start.setDate(start.getDate() + 7); // Next week
      } else {
        start.setDate(start.getDate() + daysUntilFriday);
      }
    } else {
      // Default to current time
      start = new Date(baseDate);
    }
    
    entries.push({
      id: `cron-${schedule.agent.toLowerCase()}-${index}`,
      title: schedule.title,
      start: start.toISOString(),
      end: end,
      kind: 'cron',
      tier: schedule.tier,
      agent: schedule.agent,
      projectId: null,
      source: 'cron-schedule',
      notes: `Recurring ${schedule.recurrence}`
    });
  });
  
  return entries;
}

/**
 * Extract calendar events from tasks (due dates, milestones)
 */
function extractTaskEvents(tasks) {
  const events = [];
  
  tasks.forEach(task => {
    // Look for due dates or deadlines in notes or dedicated fields
    if (task.notes && task.notes.toLowerCase().includes('due:')) {
      const dueDateMatch = task.notes.match(/due:\s*(\d{4}-\d{2}-\d{2})/i);
      if (dueDateMatch) {
        const dueDate = new Date(dueDateMatch[1] + 'T23:59:59.000Z');
        events.push({
          id: `task-due-${task.id}`,
          title: `📅 Due: ${task.title}`,
          start: dueDate.toISOString(),
          end: null,
          kind: 'reminder',
          tier: task.priority === 'P0' ? 'red' : 'yellow',
          agent: task.assigned || null,
          projectId: task.parent || null,
          source: 'task-due-date',
          notes: `Task ${task.id} due date`
        });
      }
    }
    
    // Look for milestone completions
    if (task.status === 'completed' && task.type === 'epic') {
      const completedDate = task.completedAt || task.completed;
      if (completedDate) {
        const date = new Date(completedDate);
        events.push({
          id: `epic-completed-${task.id}`,
          title: `🎉 Epic Complete: ${task.title}`,
          start: date.toISOString(),
          end: null,
          kind: 'event',
          tier: 'teal',
          agent: task.assigned || null,
          projectId: task.parent || null,
          source: 'epic-milestone',
          notes: `Epic ${task.id} completed`
        });
      }
    }
  });
  
  return events;
}

/**
 * Generate calendar.json file
 */
async function generateCalendarJson() {
  console.log('🔧 SUPER! Generating calendar.json from cron + board events...');
  
  const tasks = await fetchTasks();
  console.log(`📋 Fetched ${tasks.length} tasks for event scanning`);
  
  // Generate entries from different sources
  const cronEntries = generateCronEntries();
  const taskEvents = extractTaskEvents(tasks);
  
  // Combine and sort by start time
  const allItems = [...cronEntries, ...taskEvents].sort((a, b) => 
    new Date(a.start) - new Date(b.start)
  );
  
  const output = {
    items: allItems,
    meta: {
      generatedAt: new Date().toISOString(),
      source: 'cron+tasks+events',
      cronCount: cronEntries.length,
      taskEventCount: taskEvents.length,
      generator: 'calendar-generator.js',
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
  console.log(`📅 Calendar items: ${allItems.length} total`);
  console.log(`  🤖 Cron entries: ${cronEntries.length}`);
  console.log(`  📋 Task events: ${taskEvents.length}`);
  console.log(`⏰ Generated at: ${output.meta.generatedAt}`);
}

// Run if called directly
if (require.main === module) {
  generateCalendarJson().catch(error => {
    console.error('❌ Generator failed:', error.message);
    process.exit(1);
  });
}

module.exports = { generateCalendarJson };