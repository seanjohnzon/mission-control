#!/usr/bin/env node
/**
 * docs-generator.js
 * Generates docs/data/docs.json from repository document scan
 * Part of MC-LIVE-SYNC project - scans *.md and policy/spec files
 * 
 * Author: Franky (Chief Engineer)
 * Date: 2026-03-28
 */

const fs = require('fs');
const path = require('path');

// Config
const OUTPUT_PATH = path.join(__dirname, '../docs/data/docs.json');
const SCAN_PATHS = [
  path.join(__dirname, '../docs'),
  path.join(__dirname, '../registry')
];

/**
 * Determine document group based on filename pattern
 */
function determineGroup(filename, relativePath) {
  // D1.x through D5.x organization docs
  if (filename.match(/^D[1-5]\.\d+/)) {
    const prefix = filename.substring(0, 3);
    if (prefix === 'D1.') return 'D1.x — Organization';
    if (prefix === 'D2.') return 'D2.x — Runbooks';
    if (prefix === 'D5.') return 'D5.x — Improvement';
    return 'Policies';
  }
  
  // Registry files
  if (relativePath.includes('/registry/')) {
    return 'Registry';
  }
  
  // Catch-all
  return 'Documentation';
}

/**
 * Extract title from markdown content
 */
function extractTitle(content, filename) {
  // Look for # Title pattern in first few lines
  const lines = content.split('\n');
  for (let i = 0; i < 5; i++) {
    const line = lines[i];
    if (line && line.startsWith('# ')) {
      return line.substring(2).trim();
    }
  }
  
  // Fallback to filename without extension
  return path.basename(filename, '.md');
}

/**
 * Recursively scan directory for markdown files
 */
function scanDirectory(dirPath, basePath = dirPath) {
  const docs = [];
  
  if (!fs.existsSync(dirPath)) {
    console.warn(`Directory not found: ${dirPath}`);
    return docs;
  }
  
  const entries = fs.readdirSync(dirPath);
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry);
    const stat = fs.statSync(fullPath);
    const relativePath = path.relative(basePath, fullPath);
    
    if (stat.isDirectory()) {
      // Skip hidden directories and node_modules
      if (!entry.startsWith('.') && entry !== 'node_modules') {
        docs.push(...scanDirectory(fullPath, basePath));
      }
    } else if (stat.isFile() && entry.endsWith('.md')) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const title = extractTitle(content, entry);
        const group = determineGroup(entry, relativePath);
        
        docs.push({
          filename: entry,
          title: title,
          group: group,
          lastModified: stat.mtime.toISOString(),
          content: content,
          path: relativePath,
          sizeBytes: stat.size
        });
      } catch (error) {
        console.warn(`Failed to read ${fullPath}: ${error.message}`);
      }
    }
  }
  
  return docs;
}

/**
 * Generate docs.json file
 */
async function generateDocsJson() {
  console.log('🔧 SUPER! Generating docs.json from repository document scan...');
  
  let allDocs = [];
  
  // Scan all configured paths
  for (const scanPath of SCAN_PATHS) {
    console.log(`📁 Scanning: ${scanPath}`);
    const docs = scanDirectory(scanPath);
    allDocs.push(...docs);
    console.log(`  Found ${docs.length} documents`);
  }
  
  // Sort by group, then filename
  allDocs.sort((a, b) => {
    if (a.group !== b.group) {
      return a.group.localeCompare(b.group);
    }
    return a.filename.localeCompare(b.filename);
  });
  
  console.log(`📚 Total documents: ${allDocs.length}`);
  
  // Group summary
  const groups = {};
  allDocs.forEach(doc => {
    groups[doc.group] = (groups[doc.group] || 0) + 1;
  });
  console.log(`📂 Groups: ${Object.entries(groups).map(([g, c]) => `${g} (${c})`).join(', ')}`);
  
  const output = {
    docs: allDocs,
    meta: {
      generatedAt: new Date().toISOString(),
      source: 'repo-doc-scan',
      docCount: allDocs.length,
      groupCount: Object.keys(groups).length,
      groups: groups,
      generator: 'docs-generator.js',
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
  console.log(`📊 Document summary:`);
  Object.entries(groups).forEach(([group, count]) => {
    console.log(`  ${group}: ${count} docs`);
  });
  console.log(`⏰ Generated at: ${output.meta.generatedAt}`);
}

// Run if called directly
if (require.main === module) {
  generateDocsJson().catch(error => {
    console.error('❌ Generator failed:', error.message);
    process.exit(1);
  });
}

module.exports = { generateDocsJson };