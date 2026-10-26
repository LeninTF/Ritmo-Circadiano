import { expect, test } from '@playwright/test';
import {
  crearCuentaEIngresar,
  contarOutbox,
  obtenerClientIdsOutbox,
  obtenerAccessToken,
  generar10FechasLima,
} from './soporte';

/** Registro → login → 20 operaciones offline (café + diario) → verifica cola IndexedDB → reconexión → sincronización → idempotencia. */

test.describe('Cola offline: 20 operaciones, persistencia, sincronización e idempotencia', () => {
  test('registro offline de 10 cafés y 10 diarios → 20 en IndexedDB → sincroniza sin duplicados', async ({
    page,
    context,
    request,
  }) => {
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

    // ---------- 3. Registrar 10 diarios en fechas distintas ----------
    await page.getByRole('link', { name: 'Diario' }).click();
    await expect(page.getByRole('heading', { name: 'Diario de sueño' })).toBeVisible();

    const fechasLima = generar10FechasLima();
    for (let i = 0; i < 10; i++) {
      // Establecer la fecha explícitamente para cada diario
      await page.getByLabel('Fecha de registro').fill(fechasLima[i]);
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

    // ---------- 7. Verificar resultado en el servidor ----------
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

    // Verificar ingestas en el servidor usando request fixture (API en puerto 3000)
    const respIngestas = await request.get('http://localhost:3000/cafeina', {
      params: { fecha: fechaHoy },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect(respIngestas.ok()).toBeTruthy();
    const dataIngestas = await respIngestas.json();
    expect(dataIngestas.totalIngestas).toBe(10);

    // Verificar diarios en el servidor (rango de 10 días atrás hasta hoy)
    const fechaDesde = fechasLima[9]; // la más antigua
    const respDiarios = await request.get('http://localhost:3000/diario', {
      params: { desde: fechaDesde, hasta: fechaHoy },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect(respDiarios.ok()).toBeTruthy();
    const diarios = await respDiarios.json();
    expect(diarios.length).toBe(10);
    // Verificar que las fechas son todas distintas
    const fechasDiarios = new Set(diarios.map((d: { fecha: string }) => d.fecha));
    expect(fechasDiarios.size).toBe(10);

    // ---------- 8. Verificar idempotencia: reintentar misma operación no duplica ----------
    // Obtener una operación real de ingesta guardada en IndexedDB (filtrar por tipo 'ingesta')
    const db = await page.evaluate(async () => {
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const req = indexedDB.open('ritmo-db');
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
      const tx = db.transaction('outbox', 'readonly');
      const store = tx.objectStore('outbox');
      const getAllReq = store.getAll();
      return new Promise((resolve, reject) => {
        getAllReq.onsuccess = () => resolve(getAllReq.result);
        getAllReq.onerror = () => reject(getAllReq.error);
      });
    });

    const operacionIngesta = (db as Array<{ operation: string; clientId: string }>).find(
      (op) => op.operation === 'ingesta'
    );
    expect(operacionIngesta).toBeDefined();
    if (!operacionIngesta) throw new Error('No se encontró operación de ingesta');
    const clientIdIngesta = operacionIngesta.clientId;

    // Reintentar la misma operación directamente contra la API (manteniendo online)
    // Usar el DTO real: { operations: [...] } con clientId, operation, createdAt, payload
    const operacionOriginal = (db as Array<{
      clientId: string;
      operation: string;
      createdAt: string;
      payload: Record<string, unknown>
    }>).find((op) => op.clientId === clientIdIngesta);
    expect(operacionOriginal).toBeDefined();
    if (!operacionOriginal) throw new Error('No se encontró la operación original');

    const reintentoResp = await request.post('http://localhost:3000/sync/lote', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      data: {
        operations: [{
          clientId: operacionOriginal.clientId,
          operation: operacionOriginal.operation,
          createdAt: operacionOriginal.createdAt,
          payload: operacionOriginal.payload,
        }],
      },
    });
    expect(reintentoResp.ok()).toBeTruthy();
    const reintentoData = await reintentoResp.json();
    // Verificar que la respuesta indica 'duplicate' o 'confirmed' (idempotencia)
    const resultado = reintentoData.results[0];
    expect(['confirmed', 'duplicate']).toContain(resultado.status);

    // Volver a contar ingestas en servidor: debe seguir siendo 10 (sin duplicados)
    const respIngestas2 = await request.get('http://localhost:3000/cafeina', {
      params: { fecha: fechaHoy },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect(respIngestas2.ok()).toBeTruthy();
    const dataIngestas2 = await respIngestas2.json();
    expect(dataIngestas2.totalIngestas).toBe(10);

    // Verificar que los diarios también se mantienen sin duplicados
    const respDiarios2 = await request.get('http://localhost:3000/diario', {
      params: { desde: fechaDesde, hasta: fechaHoy },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect(respDiarios2.ok()).toBeTruthy();
    const diarios2 = await respDiarios2.json();
    expect(diarios2.length).toBe(10);

    // Verificar que no hay operaciones pendientes en la cola
    const pendientesFinal = await contarOutbox(page);
    expect(pendientesFinal).toBe(0);
  });
});
