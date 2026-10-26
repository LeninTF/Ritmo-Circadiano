import { expect, test, type Page } from '@playwright/test';

/** Registro → login → 20 operaciones offline (café + diario) → verifica cola IndexedDB → reconexión → sincronización → idempotencia. */

const CLAVE = 'Ruta2026e2e';

async function crearCuentaEIngresar(page: Page): Promise<string> {
  const correo = `e2e.${Date.now()}.${Math.floor(Math.random() * 1e6)}@circaruta.test`;

  await page.goto('/consentimiento');
  await page.getByLabel('Acepto participar en el estudio').check();
  await page.getByRole('button', { name: 'Continuar' }).click();

  await expect(page.getByRole('heading', { name: 'Crear cuenta' })).toBeVisible();
  await page.getByLabel('Correo').fill(correo);
  await page.getByLabel('Clave').fill(CLAVE);
  const area = page.getByLabel('Área');
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

/** Cuenta registros en la tabla outbox de IndexedDB para el usuario actual. */
async function contarOutbox(page: Page): Promise<number> {
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

/** Obtiene todos los clientIds de la tabla outbox. */
async function obtenerClientIdsOutbox(page: Page): Promise<string[]> {
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

/** Obtiene el accessToken del localStorage para llamar a la API. */
async function obtenerAccessToken(page: Page): Promise<string | null> {
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

/** Llama a GET /cafeina para listar ingestas del día actual y cuenta cuántas hay. */
async function contarIngestasServidor(page: Page, accessToken: string, fecha: string): Promise<number> {
  return page.evaluate(async ({ token, fechaStr }) => {
    const resp = await fetch(`/cafeina?fecha=${fechaStr}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!resp.ok) throw new Error(`Error ${resp.status}`);
    const data = await resp.json();
    return data.length;
  }, { token: accessToken, fechaStr: fecha });
}
test.describe('Cola offline: 20 operaciones, persistencia, sincronización e idempotencia', () => {
  test('registro offline de 10 cafés y 10 diarios → 20 en IndexedDB → sincroniza sin duplicados', async ({ page, context }) => {
    await crearCuentaEIngresar(page);

    // ---------- 1. Poner el navegador offline ----------
    await context.setOffline(true);

    // ---------- 2. Registrar 10 cafés ----------
    await page.getByRole('link', { name: 'Cafeína' }).click();
    await expect(page.getByRole('heading', { name: 'Mi consumo' })).toBeVisible();

    for (let i = 0; i < 10; i++) {
      await page.getByRole('link', { name: 'Registrar café' }).click();
      await page.getByRole('button', { name: /Café pasado/ }).click();
      await page.getByRole('button', { name: 'Guardar' }).click();
      await expect(page.getByText('Guardado en tu teléfono. Se enviará cuando tengas señal.')).toBeVisible();
      // Volver a la lista para la siguiente iteración
      await page.getByRole('link', { name: 'Cafeína' }).click();
    }

    // ---------- 3. Registrar 10 diarios ----------
    await page.getByRole('link', { name: 'Diario' }).click();
    await expect(page.getByRole('heading', { name: 'Diario de sueño' })).toBeVisible();

    for (let i = 0; i < 10; i++) {
      // Los valores por defecto ya son válidos (fecha de hoy, 22:00 / 06:00, etc.)
      await page.getByRole('button', { name: 'Guardar diario' }).click();
      await expect(page.locator('.estado-alerta.exito')).toBeVisible({ timeout: 5_000 });
    }

    // ---------- 4. Verificar 20 operaciones en IndexedDB ----------
    const totalEnCola = await contarOutbox(page);
    expect(totalEnCola).toBe(20);

    const clientIds = await obtenerClientIdsOutbox(page);
    expect(clientIds.length).toBe(20);
    // Verificar unicidad de los clientIds
    const unicos = new Set(clientIds);
    expect(unicos.size).toBe(20);

    // ---------- 5. Restaurar conectividad ----------
    await context.setOffline(false);

    // ---------- 6. Esperar a que la cola se vacíe (sincronización) ----------
    await expect(async () => {
      const pendientes = await contarOutbox(page);
      expect(pendientes).toBe(0);
    }).toPass({ timeout: 60_000 });

    // ---------- 7. Verificar resultado en el servidor (idempotencia) ----------
    const accessToken = await obtenerAccessToken(page);
    expect(accessToken).not.toBeNull();
    if (!accessToken) throw new Error('No se pudo obtener accessToken');

    // Obtener fecha de hoy en zona de Lima (YYYY-MM-DD)
    const fechaHoy = await page.evaluate(() => {
      const ahora = new Date();
      // Lima = UTC-5, sin horario de verano
      const lima = new Date(ahora.getTime() - 5 * 60 * 60 * 1000);
      return lima.toISOString().slice(0, 10);
    });

    const ingestasEnServidor = await contarIngestasServidor(page, accessToken, fechaHoy);
    // Deben ser exactamente 10 (los cafés); los diarios van a otro endpoint
    expect(ingestasEnServidor).toBe(10);

    // ---------- 8. Verificar idempotencia: reintentar misma operación no duplica ----------
    // Capturar el clientId de la primera operación de café (el primero en la cola original)
    const primerClientId = clientIds[0];
    // Volver a poner offline y enviar manualmente la misma operación con el mismo clientId
    // usando fetch directo a /sync/lote simulando reintento.
    await context.setOffline(true);
    await page.evaluate(async (cid) => {
      const payload = {
        clientId: cid,
        operation: 'ingesta',
        payload: { id_bebida: 2, porciones: 1 }, // Café pasado
      };
      // El transport real usa POST /sync/lote con array de operaciones.
      // Aquí llamamos directo al endpoint para forzar reintento con mismo clientId.
      const token = (() => {
        try {
          const crudo = localStorage.getItem('gestor-circadiano-sesion');
          return crudo ? JSON.parse(crudo).accessToken : '';
        } catch { return ''; }
      })();
      await fetch('/sync/lote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ operaciones: [payload] }),
      });
    }, primerClientId);
    await context.setOffline(false);

    // Esperar a que el reintento se procese
    await page.waitForTimeout(3_000);

    // Volver a contar ingestas en servidor: debe seguir siendo 10 (sin duplicados)
    const ingestasDespuesReintento = await contarIngestasServidor(page, accessToken, fechaHoy);
    expect(ingestasDespuesReintento).toBe(10);
  });
});