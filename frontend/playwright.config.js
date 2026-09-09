import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  expect: {
    timeout: 10000,
  },
  fullyParallel: false,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    channel: 'chrome',
  },
  projects: [
    {
      name: 'chrome',
      use: {
        channel: 'chrome',
      },
    },
  ],
  webServer: [
    {
      command: 'npm run start',
      cwd: '../backend',
      port: 5000,
      reuseExistingServer: true,
      timeout: 20000,
    },
    {
      command: 'npm run dev',
      cwd: '.',
      port: 5173,
      reuseExistingServer: true,
      timeout: 20000,
    },
  ],
});
