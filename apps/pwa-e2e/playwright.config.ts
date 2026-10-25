import { randomBytes } from 'node:crypto';
import { defineConfig, devices } from '@playwright/test';

/**
 * E2E del flujo del trabajador en un navegador real (CLAUDE.md §2, RNF03).
 * Requiere PostgreSQL con migraciones y seed: `docker compose up -d && npm run db:setup`.
 * Si la API (:3000) o la PWA (:4200) ya están corriendo, las reutiliza.
 */
export default defineConfig({
  testDir: './src',
  outputDir: '../../dist/.playwright/pwa-e2e/resultados',
  fullyParallel: false,
  workers: 1,
  retries: process.env['CI'] ? 1 : 0,
  reporter: [['list'], ['html', { outputFolder: '../../dist/.playwright/pwa-e2e/reporte', open: 'never' }]],
  use: {
    baseURL: 'http://localhost:4200',
    locale: 'es-PE',
    timezoneId: 'America/Lima',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'movil', use: { ...devices['Pixel 7'] } }],
  webServer: [
    {
      command: 'npx nx serve api',
      url: 'http://localhost:3000/health',
      // Secreto temporal por corrida: el e2e no depende del .env local ni guarda secretos.
      env: { JWT_SECRET: randomBytes(32).toString('hex') },
      reuseExistingServer: true,
      timeout: 180_000,
    },
    {
      // El .env raíz trae PORT=3000 para la API; la PWA necesita el suyo.
      command: 'npx nx serve pwa',
      url: 'http://localhost:4200',
      env: { PORT: '4200' },
      reuseExistingServer: true,
      timeout: 180_000,
    },
  ],
});
