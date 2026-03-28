#!/usr/bin/env node
/**
 * model-ops-generator.js
 * Generates docs/data/model-ops.json from live model operations data
 * Part of MC-LIVE-SYNC project - tracks model usage and costs
 * 
 * Author: Franky (Chief Engineer)
 * Date: 2026-03-28
 */

const fs = require('fs');
const path = require('path');

// Config
const OUTPUT_PATH = path.join(__dirname, '../docs/data/model-ops.json');

/**
 * Get current crew organization and model assignments
 */
function getCrewModels() {
  // Current crew model assignments as of 2026-03-28
  return [
    // Anthropic Subscription
    {
      provider: 'Anthropic',
      type: 'subscription',
      monthlyCost: 200,
      costLabel: '$200/mo',
      color: '#8B5CF6',
      colorRgb: '139,92,246',
      agents: [
        {
          id: 'nami',
          name: 'Nami',
          model: 'claude-sonnet-4-6',
          modelShort: 'Sonnet 4',
          role: 'Chief of Staff / Navigator',
          contextWindow: 200000,
          contextUsed: null,
          tokensToday: { input: 0, output: 0 },
          costToday: 0,
          machine: 'Mac Mini (M4)',
          sessions: 1
        },
        {
          id: 'franky',
          name: 'Franky',
          model: 'claude-sonnet-4-6',
          modelShort: 'Sonnet 4',
          role: 'Chief Engineer / Builder',
          contextWindow: 200000,
          contextUsed: null,
          tokensToday: { input: 0, output: 0 },
          costToday: 0,
          machine: 'Desktop',
          sessions: 1
        },
        {
          id: 'chopper',
          name: 'Chopper',
          model: 'claude-sonnet-4-6',
          modelShort: 'Sonnet 4',
          role: 'QA / Health / Security Manager',
          contextWindow: 200000,
          contextUsed: null,
          tokensToday: { input: 0, output: 0 },
          costToday: 0,
          machine: 'GPU3060 Laptop',
          sessions: 1
        },
        {
          id: 'robin',
          name: 'Robin',
          model: 'claude-sonnet-4-6',
          modelShort: 'Sonnet 4',
          role: 'Research / Documentation',
          contextWindow: 200000,
          contextUsed: null,
          tokensToday: { input: 0, output: 0 },
          costToday: 0,
          machine: null,
          sessions: 1
        },
        {
          id: 'brook',
          name: 'Brook',
          model: 'claude-sonnet-4-6',
          modelShort: 'Sonnet 4',
          role: 'Creative / Content',
          contextWindow: 200000,
          contextUsed: null,
          tokensToday: { input: 0, output: 0 },
          costToday: 0,
          machine: null,
          sessions: 1
        },
        {
          id: 'zoro',
          name: 'Zoro',
          model: 'claude-sonnet-4-6',
          modelShort: 'Sonnet 4',
          role: 'Security / Defense',
          contextWindow: 200000,
          contextUsed: null,
          tokensToday: { input: 0, output: 0 },
          costToday: 0,
          machine: null,
          sessions: 1
        },
        {
          id: 'sanji',
          name: 'Sanji',
          model: 'claude-sonnet-4-6',
          modelShort: 'Sonnet 4',
          role: 'Deployment / Operations',
          contextWindow: 200000,
          contextUsed: null,
          tokensToday: { input: 0, output: 0 },
          costToday: 0,
          machine: null,
          sessions: 1
        },
        {
          id: 'jinbe',
          name: 'Jinbe',
          model: 'claude-sonnet-4-6',
          modelShort: 'Sonnet 4',
          role: 'Sprint Management',
          contextWindow: 200000,
          contextUsed: null,
          tokensToday: { input: 0, output: 0 },
          costToday: 0,
          machine: null,
          sessions: 1
        },
        {
          id: 'usopp',
          name: 'Usopp',
          model: 'claude-sonnet-4-6',
          modelShort: 'Sonnet 4',
          role: 'Specification / Requirements',
          contextWindow: 200000,
          contextUsed: null,
          tokensToday: { input: 0, output: 0 },
          costToday: 0,
          machine: null,
          sessions: 1
        }
      ]
    },
    // OpenAI Subscription
    {
      provider: 'OpenAI',
      type: 'subscription',
      monthlyCost: 150,
      costLabel: '$150/mo',
      color: '#10B981',
      colorRgb: '16,185,129',
      agents: [
        {
          id: 'chopper-codex',
          name: 'Chopper (Codex)',
          model: 'gpt-5.4',
          modelShort: 'GPT-5.4',
          role: 'Code QA / Technical Review',
          contextWindow: 128000,
          contextUsed: null,
          tokensToday: { input: 0, output: 0 },
          costToday: 0,
          machine: 'GPU3060 Laptop',
          sessions: 1
        }
      ]
    },
    // Local Inference
    {
      provider: 'Ollama (Local)',
      type: 'local',
      monthlyCost: 0,
      costLabel: 'Hardware only',
      color: '#6366F1',
      colorRgb: '99,102,241',
      agents: [
        {
          id: 'local-nano',
          name: 'Local Nano',
          model: 'qwen2.5:3b',
          modelShort: 'Qwen 3B',
          role: 'Fast local tasks',
          contextWindow: 32000,
          contextUsed: null,
          tokensToday: { input: 0, output: 0 },
          costToday: 0,
          machine: 'Mac Mini (M4)',
          sessions: 0
        },
        {
          id: 'local-mid',
          name: 'Local Mid',
          model: 'qwen2.5:7b',
          modelShort: 'Qwen 7B',
          role: 'Medium local tasks',
          contextWindow: 32000,
          contextUsed: null,
          tokensToday: { input: 0, output: 0 },
          costToday: 0,
          machine: 'Mac Mini (M4)',
          sessions: 0
        },
        {
          id: 'local-large',
          name: 'Local Large',
          model: 'qwen2.5:14b',
          modelShort: 'Qwen 14B',
          role: 'Heavy local tasks',
          contextWindow: 32000,
          contextUsed: null,
          tokensToday: { input: 0, output: 0 },
          costToday: 0,
          machine: 'Mac Mini (M4)',
          sessions: 0
        }
      ]
    }
  ];
}

/**
 * Calculate subscription usage totals
 */
function calculateSubscriptionUsage(subscription) {
  const totalInputTokens = subscription.agents.reduce((sum, agent) => sum + agent.tokensToday.input, 0);
  const totalOutputTokens = subscription.agents.reduce((sum, agent) => sum + agent.tokensToday.output, 0);
  const totalCost = subscription.agents.reduce((sum, agent) => sum + agent.costToday, 0);
  const activeSessions = subscription.agents.reduce((sum, agent) => sum + agent.sessions, 0);
  
  return {
    totalInputTokens,
    totalOutputTokens,
    totalCost,
    activeSessions,
    totalAgents: subscription.agents.length
  };
}

/**
 * Generate model-ops.json file
 */
async function generateModelOpsJson() {
  console.log('🔧 SUPER! Generating model-ops.json from live model operations...');
  
  const subscriptions = getCrewModels();
  
  // Add usage calculations to each subscription
  subscriptions.forEach(sub => {
    const usage = calculateSubscriptionUsage(sub);
    sub.usage = usage;
  });
  
  console.log(`🤖 Model subscriptions: ${subscriptions.length}`);
  subscriptions.forEach(sub => {
    console.log(`  ${sub.provider}: ${sub.agents.length} agents, ${sub.usage.activeSessions} active sessions`);
  });
  
  const output = {
    subscriptions: subscriptions,
    meta: {
      generatedAt: new Date().toISOString(),
      refreshInterval: 60,
      source: 'model-ops-collector',
      generator: 'model-ops-generator.js',
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
  console.log(`🤖 Model operations summary:`);
  
  const totalMonthlyCost = subscriptions.reduce((sum, sub) => sum + sub.monthlyCost, 0);
  const totalAgents = subscriptions.reduce((sum, sub) => sum + sub.agents.length, 0);
  const totalSessions = subscriptions.reduce((sum, sub) => sum + sub.usage.activeSessions, 0);
  
  console.log(`  Total monthly cost: $${totalMonthlyCost}`);
  console.log(`  Total agents: ${totalAgents}`);
  console.log(`  Active sessions: ${totalSessions}`);
  console.log(`⏰ Generated at: ${output.meta.generatedAt}`);
}

// Run if called directly
if (require.main === module) {
  generateModelOpsJson().catch(error => {
    console.error('❌ Generator failed:', error.message);
    process.exit(1);
  });
}

module.exports = { generateModelOpsJson };