import { defineConfig, devices } from '@playwright/test';
import { E2E_API_PORT, E2E_API_URL, E2E_WEB_PORT } from './e2e/test-env';

export default defineConfig({
  testDir: './e2e',
  // Tests share one API database, so run them one at a time
  workers: 1,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${E2E_WEB_PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chromium',
        viewport: { width: 1440, height: 900 },
      },
    },
  ],
  webServer: [
    {
      command: 'node e2e/start-test-api.mjs',
      url: `${E2E_API_URL}/users`,
      env: { E2E_API_PORT: String(E2E_API_PORT) },
      reuseExistingServer: false,
      // Let the script remove its temp copy of db.json before it exits
      gracefulShutdown: { signal: 'SIGTERM', timeout: 5000 },
    },
    {
      command: `vite --port ${E2E_WEB_PORT} --strictPort`,
      url: `http://localhost:${E2E_WEB_PORT}`,
      // Trailing slash is required: api routes have no leading slash
      env: { VITE_LOCAL_API_URL: `${E2E_API_URL}/`, VITE_ENV: 'local' },
      reuseExistingServer: false,
    },
  ],
});
