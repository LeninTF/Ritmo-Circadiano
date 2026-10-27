import { expect, type Page } from '@playwright/test';

const CLAVE = 'Ruta2026e2e';

/** Lo que guarda OutboxService en el store Dexie `outbox` (CLAUDE.md §7). */
export interface OperacionOutbox {
  clientId: string;
  operation: string;
  createdAt: string;
  payload: Record<string, unknown>;
}

/**
 * Crea una cuenta e inicia sesión, devolviendo el correo usado.
 * Flujo real: consentimiento → crear cuenta → ingresar → landing /plan.
 */
export async function crearCuentaEIngresar(page: Page): Promise<string> {
  const correo = `e2e.${Date.now()}.${Math.floor(Math.random() * 1e6)}@circaruta.test`;

  await page.goto('/consentimiento');
  await page.getByLabel('Acepto participar en el estudio').check();
  await page.getByRole('button', { name: 'Continuar' }).click();

  await expect(
    page.getByRole('heading', { name: 'Crear cuenta' }),
  ).toBeVisible();
  await page.getByLabel('Correo').fill(correo);
  await page.getByLabel('Clave').fill(CLAVE);
  const area = page.getByLabel('Área');
  await expect(area.locator('option')).not.toHaveCount(1);
  await area.selectOption({ index: 1 });
  await page.getByRole('button', { name: 'Crear cuenta' }).click();

  await expect(
    page.getByRole('heading', { name: 'Registro listo' }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Ingresar' }).click();
  await page.getByLabel('Correo').fill(correo);
  await page.getByLabel('Clave').fill(CLAVE);
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await expect(page).toHaveURL(/\/plan$/);

  return correo;
}

/** Lee todas las operaciones pendientes del outbox de IndexedDB. */
export async function leerOutbox(page: Page): Promise<OperacionOutbox[]> {
  return page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open('ritmo-db');
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return new Promise<OperacionOutbox[]>((resolve, reject) => {
      const req = db
        .transaction('outbox', 'readonly')
        .objectStore('outbox')
        .getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  });
}

export async function contarOutbox(page: Page): Promise<number> {
  return (await leerOutbox(page)).length;
}

/** Obtiene el accessToken del localStorage para llamar a la API. */
export async function obtenerAccessToken(page: Page): Promise<string | null> {
  return page.evaluate(() => {
    try {
      const crudo = localStorage.getItem('gestor-circadiano-sesion');
      if (!crudo) return null;
      const datos = JSON.parse(crudo);
      return datos.accessToken ?? null;
    } catch {
      return null;
    }
  });
}

/**
 * Fechas civiles de Lima (UTC-5, sin horario de verano), de hoy hacia atrás.
 * Fechas distintas evitan el upsert por UNIQUE(id_usuario, fecha) de registro_sueno.
 */
export function generarFechasLima(n = 10, ahora = new Date()): string[] {
  const lima = new Date(ahora.getTime() - 5 * 60 * 60 * 1000);
  return Array.from({ length: n }, (_, i) => {
    const fecha = new Date(lima);
    fecha.setUTCDate(fecha.getUTCDate() - i);
    return fecha.toISOString().slice(0, 10);
  });
}
