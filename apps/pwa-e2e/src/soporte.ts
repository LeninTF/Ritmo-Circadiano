import { expect, type Page } from '@playwright/test';

const CLAVE = 'Ruta2026e2e';

/**
 * Crea una cuenta e inicia sesiÃ³n, devolviendo el correo usado.
 * Flujo real: consentimiento â†’ crear cuenta â†’ ingresar â†’ landing /plan.
 */
export async function crearCuentaEIngresar(page: Page): Promise<string> {
  const correo = `e2e.${Date.now()}.${Math.floor(Math.random() * 1e6)}@circaruta.test`;

  await page.goto('/consentimiento');
  await page.getByLabel('Acepto participar en el estudio').check();
  await page.getByRole('button', { name: 'Continuar' }).click();

  await expect(page.getByRole('heading', { name: 'Crear cuenta' })).toBeVisible();
  await page.getByLabel('Correo').fill(correo);
  await page.getByLabel('Clave').fill(CLAVE);
  const area = page.getByLabel('Ãrea');
  await expect(area.locator('option')).not.toHaveCount(1);
  await area.selectOption({ index: 1 });
  await page.getByRole('button', { name: 'Crear cuenta' }).click();

  await expect(page.getByRole('heading', { name: 'Registro listo' })).toBeVisible();
  await page.getByRole('link', { name: 'Ingresar' }).click();
  await page.getByLabel('Correo').fill(correo);
  await page.getByLabel('Clave').fill(CLAVE);
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await expect(page).toHaveURL(/\/plan$/);

  return correo;
}

/**
 * Cuenta registros en la tabla outbox de IndexedDB para el usuario actual.
 */
export async function contarOutbox(page: Page): Promise<number> {
  return page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open('ritmo-db');
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    const tx = db.transaction('outbox', 'readonly');
    const store = tx.objectStore('outbox');
    const countReq = store.count();
    return new Promise<number>((resolve, reject) => {
      countReq.onsuccess = () => resolve(countReq.result);
      countReq.onerror = () => reject(countReq.error);
    });
  });
}

/**
 * Obtiene todos los clientIds de la tabla outbox.
 */
export async function obtenerClientIdsOutbox(page: Page): Promise<string[]> {
  return page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open('ritmo-db');
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    const tx = db.transaction('outbox', 'readonly');
    const store = tx.objectStore('outbox');
    const getAllReq = store.getAll();
    return new Promise<string[]>((resolve, reject) => {
      getAllReq.onsuccess = () =>
        resolve(getAllReq.result.map((r: { clientId: string }) => r.clientId));
      getAllReq.onerror = () => reject(getAllReq.error);
    });
  });
}

/**
 * Obtiene el accessToken del localStorage para llamar a la API.
 */
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
 * Genera 10 fechas civiles distintas en zona America/Lima (UTC-5).
 * Evita colisiones por UNIQUE(id_usuario, fecha) en registro_sueno.
 */
export function generar10FechasLima(): string[] {
  const fechas: string[] = [];
  const ahora = new Date();
  // Convertir a zona de Lima (UTC-5)
  const limaOffset = -5 * 60; // minutos
  const limaTime = new Date(ahora.getTime() + limaOffset * 60_000);

  for (let i = 0; i < 10; i++) {
    const fecha = new Date(limaTime);
    fecha.setDate(fecha.getDate() - i);
    fechas.push(fecha.toISOString().slice(0, 10)); // YYYY-MM-DD
  }
  return fechas;
}
