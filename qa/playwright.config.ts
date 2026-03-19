import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 1,
  workers: 3, // Parallel — Chopper's subagents

  projects: [
    {
      name: 'visual',
      testMatch: /visual\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], headless: true },
    },
    {
      name: 'network',
      testMatch: /network\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], headless: true },
    },
    {
      name: 'components',
      testMatch: /components\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], headless: true },
    },
  ],

  reporter: [
    ['github'],
    ['html', { outputFolder: 'test-results/html', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],

  webServer: {
    command: 'serve ./dist -p 5174',
    port: 5174,
    reuseExistingServer: true,
  },
});
