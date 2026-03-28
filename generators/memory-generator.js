#!/usr/bin/env node
/**
 * memory-generator.js
 * Generates docs/data/memory.json from workspace daily memory files
 * Part of MC-LIVE-SYNC project - aggregates crew memory
 * 
 * Author: Franky (Chief Engineer)
 * Date: 2026-03-28
 */

const fs = require('fs');
const path = require('path');

// Config
const OUTPUT_PATH = path.join(__dirname, '../docs/data/memory.json');
const WORKSPACE_PATHS = [
  '/Users/minicihan/.openclaw/workspace/memory',
  '/Users/minicihan/.openclaw/workspace-franky/memory'
];

/**
 * Extract meaningful content from markdown
 */
function extractMemoryContent(filePath, content) {
  const lines = content.split('\n');
  const sections = [];
  let currentSection = null;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip empty lines and file headers
    if (!trimmed || trimmed.startsWith('#') && trimmed.includes('Daily Memory')) {
      continue;
    }
    
    // Detect section headers (## timestamp — title)
    const sectionMatch = trimmed.match(/^##\s+(.+)/);
    if (sectionMatch) {
      if (currentSection) {
        sections.push(currentSection);
      }
      
      const headerText = sectionMatch[1];
      const timestampMatch = headerText.match(/(\d{2}:\d{2}\s+\w+)\s*—\s*(.+)/);
      
      currentSection = {
        timestamp: timestampMatch ? timestampMatch[1] : 'Unknown time',
        title: timestampMatch ? timestampMatch[2] : headerText,
        content: []
      };
    } else if (currentSection && trimmed) {
      // Add content to current section
      currentSection.content.push(trimmed);
    }
  }
  
  if (currentSection) {
    sections.push(currentSection);
  }
  
  return sections;
}

/**
 * Scan workspace memory directories
 */
async function scanMemoryFiles() {
  const entries = [];
  
  for (const dir of WORKSPACE_PATHS) {
    if (!fs.existsSync(dir)) {
      console.warn(`Memory directory not found: ${dir}`);
      continue;
    }
    
    const files = fs.readdirSync(dir)
      .filter(file => file.match(/^\d{4}-\d{2}-\d{2}\.md$/))
      .sort()
      .reverse(); // Newest first
    
    console.log(`📁 Scanning ${dir}: ${files.length} daily files`);
    
    for (const file of files.slice(0, 15)) { // Last 15 days per workspace
      const filePath = path.join(dir, file);
      const date = file.replace('.md', '');
      
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const sections = extractMemoryContent(filePath, content);
        
        if (sections.length > 0) {
          // Create summary from sections
          const titles = sections.map(s => s.title).join(', ');
          const contentSummary = sections.map(s => 
            `**${s.timestamp}**: ${s.title}\n${s.content.slice(0, 2).join('\n')}`
          ).join('\n\n');
          
          // Extract tags from content
          const allContent = content.toLowerCase();
          const tags = [];
          if (allContent.includes('heartbeat')) tags.push('heartbeat');
          if (allContent.includes('generator') || allContent.includes('built')) tags.push('engineering');
          if (allContent.includes('completed') || allContent.includes('✅')) tags.push('completed');
          if (allContent.includes('mc-live-sync')) tags.push('mc-live-sync');
          if (allContent.includes('task')) tags.push('tasks');
          if (allContent.includes('commit')) tags.push('commits');
          
          entries.push({
            date: date,
            title: titles.length > 50 ? titles.substring(0, 47) + '...' : titles,
            content: contentSummary,
            tags: tags,
            sourcePath: filePath
          });
        }
      } catch (error) {
        console.warn(`Failed to read memory file ${filePath}: ${error.message}`);
      }
    }
  }
  
  // Sort by date descending and deduplicate by date
  const uniqueEntries = [];
  const seenDates = new Set();
  
  for (const entry of entries.sort((a, b) => b.date.localeCompare(a.date))) {
    if (!seenDates.has(entry.date)) {
      seenDates.add(entry.date);
      uniqueEntries.push(entry);
    }
  }
  
  return uniqueEntries.slice(0, 20); // Last 20 unique days
}

/**
 * Generate memory.json file
 */
async function generateMemoryJson() {
  console.log('🔧 SUPER! Generating memory.json from workspace daily files...');
  
  const daily = await scanMemoryFiles();
  console.log(`📝 Processed memory files, found ${daily.length} day entries`);
  
  const output = {
    daily: daily,
    meta: {
      generatedAt: new Date().toISOString(),
      source: 'memory-daily',
      dayCount: daily.length,
      generator: 'memory-generator.js',
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
  console.log(`📅 Memory entries: ${daily.length} days`);
  if (daily.length > 0) {
    console.log(`📝 Date range: ${daily[daily.length - 1].date} to ${daily[0].date}`);
  }
  console.log(`⏰ Generated at: ${output.meta.generatedAt}`);
}

// Run if called directly
if (require.main === module) {
  generateMemoryJson().catch(error => {
    console.error('❌ Generator failed:', error.message);
    process.exit(1);
  });
}

module.exports = { generateMemoryJson };