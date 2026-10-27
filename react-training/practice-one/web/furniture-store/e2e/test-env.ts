// Dedicated ports so the suite never reuses the dev API (5001) or Vite (5173)
export const E2E_API_PORT = 5101;
export const E2E_WEB_PORT = 5174;
export const E2E_API_URL = `http://localhost:${E2E_API_PORT}`;
