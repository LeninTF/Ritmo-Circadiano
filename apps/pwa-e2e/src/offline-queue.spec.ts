import { expect, test } from '@playwright/test';
import {
  crearCuentaEIngresar,
  contarOutbox,
  leerOutbox,
  obtenerAccessToken,
  generarFechasLima,
} from './soporte';

/**
 * RNF03: modo avión → plan visible, 10 cafés y 10 diarios en IndexedDB → reconexión →
 * 20 registros en el servidor → reintento con el mismo client_id sin duplicar.
 */

const API = 'http://localhost:3000';

test.describe('Cola offline: 20 operaciones, persistencia, sincronización e idempotencia', () => {
  test('registro offline de 10 cafés y 10 diarios → 20 en IndexedDB → sincroniza sin duplicados', async ({
    page,
    context,
    request,
  }) => {
    await crearCuentaEIngresar(page);

    // ---------- 1. Precargar las pantallas con red y poner el navegador offline ----------
    // `nx serve` no registra el service worker: sin esta visita, los chunks lazy de
    // Cafeína y Diario no se pueden descargar en modo avión (igual que en flujo-cafeina).
    await page.getByRole('link', { name: 'Cafeína' }).click();
    await page.getByRole('link', { name: 'Registrar café' }).click();
    await expect(
      page.getByRole('button', { name: /Café pasado/ }),
    ).toBeVisible();
    await page.getByRole('link', { name: 'Diario' }).click();
    await expect(
      page.getByRole('heading', { name: 'Diario de sueño' }),
    ).toBeVisible();
    await page.getByRole('link', { name: 'Hoy' }).click();
    await context.setOffline(true);

    // ---------- 2. Consultar el plan sin conexión (RNF03: "consulta su plan") ----------
    await page.getByRole('link', { name: 'Cafeína' }).click();
    await page.getByRole('link', { name: 'Hoy' }).click();
    await expect(page).toHaveURL(/\/plan$/);
    // shortcut: la cuenta nueva no tiene turno, así que se verifica que la pantalla del plan
    // carga sin red (sin error), no la ventana de descanso; ampliar cuando el e2e pueda sembrar un turno.
    await expect(
      page.getByRole('heading', { name: 'Mi plan del día' }),
    ).toBeVisible();
    await expect(page.getByText('No tienes turnos próximos')).toBeVisible();
    await expect(page.getByText('No pudimos cargar tu plan')).toHaveCount(0);

    // ---------- 3. Registrar 10 cafés ----------
    await page.getByRole('link', { name: 'Cafeína' }).click();
    await expect(
      page.getByRole('heading', { name: 'Mi consumo' }),
    ).toBeVisible();

    for (let i = 0; i < 10; i++) {
      await page.getByRole('link', { name: 'Registrar café' }).click();
      await page.getByRole('button', { name: /Café pasado/ }).click();
      await page.getByRole('button', { name: 'Guardar' }).click();
      await expect(
        page.getByText(
          'Guardado en tu teléfono. Se enviará cuando tengas señal.',
        ),
      ).toBeVisible();
      await page.getByRole('link', { name: 'Cafeína' }).click();
    }

    // ---------- 4. Registrar 10 diarios en fechas distintas ----------
    await page.getByRole('link', { name: 'Diario' }).click();
    await expect(
      page.getByRole('heading', { name: 'Diario de sueño' }),
    ).toBeVisible();

    const fechasLima = generarFechasLima(10);
    const fechaHoy = fechasLima[0];
    for (const fecha of fechasLima) {
      await page.getByLabel('Fecha de registro').fill(fecha);
      await page.getByRole('button', { name: 'Guardar diario' }).click();
      await expect(page.locator('.estado-alerta.exito')).toBeVisible({
        timeout: 5_000,
      });
    }

    // ---------- 5. Verificar 20 operaciones en IndexedDB (antes de reconectar) ----------
    // poll: el último enqueue del diario puede no haber llegado aún a IndexedDB.
    await expect.poll(() => contarOutbox(page), { timeout: 10_000 }).toBe(20);
    const cola = await leerOutbox(page);
    expect(new Set(cola.map((op) => op.clientId)).size).toBe(20);
    expect(cola.filter((op) => op.operation === 'ingesta')).toHaveLength(10);
    expect(cola.filter((op) => op.operation === 'diario')).toHaveLength(10);
    // Se guarda ahora: el outbox borra cada operación en cuanto el servidor la confirma.
    const operacionIngesta = cola.find((op) => op.operation === 'ingesta');
    if (!operacionIngesta)
      throw new Error('No hay operaciones de ingesta en la cola');

    // ---------- 6. Restaurar conectividad y esperar a que la cola se vacíe ----------
    await context.setOffline(false);
    await expect.poll(() => contarOutbox(page), { timeout: 60_000 }).toBe(0);

    // ---------- 7. Verificar los 20 registros en el servidor ----------
    const accessToken = await obtenerAccessToken(page);
    if (!accessToken) throw new Error('No se pudo obtener accessToken');
    const headers = { Authorization: `Bearer ${accessToken}` };

    const contarIngestasServidor = async () => {
      const resp = await request.get(`${API}/cafeina`, {
        params: { fecha: fechaHoy },
        headers,
      });
      expect(resp.ok()).toBeTruthy();
      const ingestas: { id_ingesta: number }[] = await resp.json();
      expect(new Set(ingestas.map((i) => i.id_ingesta)).size).toBe(
        ingestas.length,
      );
      return ingestas.length;
    };
    const leerDiariosServidor = async () => {
      const resp = await request.get(`${API}/diario`, {
        params: { desde: fechasLima[fechasLima.length - 1], hasta: fechaHoy },
        headers,
      });
      expect(resp.ok()).toBeTruthy();
      const diarios: { fecha: string }[] = await resp.json();
      return diarios;
    };

    expect(await contarIngestasServidor()).toBe(10);
    const diarios = await leerDiariosServidor();
    expect(diarios).toHaveLength(10);
    expect(new Set(diarios.map((d) => d.fecha))).toEqual(new Set(fechasLima));

    // ---------- 8. Idempotencia: reenviar la misma operación no duplica ----------
    // Formato wire de SyncLoteWireDto (snake_case); el registro de Dexie trae además campos internos.
    const { clientId, operation, createdAt, payload } = operacionIngesta;
    const reintento = await request.post(`${API}/sync/lote`, {
      headers,
      data: {
        operations: [
          { client_id: clientId, created_at: createdAt, operation, payload },
        ],
      },
    });
    expect(reintento.ok(), await reintento.text()).toBeTruthy();
    const { results } = await reintento.json();
    // registrarIngesta devuelve la fila existente cuando el client_id es del mismo usuario.
    expect(results).toEqual([
      expect.objectContaining({
        client_id: clientId,
        status: 'confirmed',
      }),
    ]);

    expect(await contarIngestasServidor()).toBe(10);
    expect(await leerDiariosServidor()).toHaveLength(10);
    expect(await contarOutbox(page)).toBe(0);
  });
});
