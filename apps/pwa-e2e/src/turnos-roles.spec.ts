import { expect, test, type Page } from '@playwright/test';

/**
 * RF04 + cierre de sesión por rol, en 390 px y con las cuentas del seed (J01, D01, T01, A01).
 * Requiere SEED_DEMO_CLAVE, SEED_ADMIN_CORREO y SEED_ADMIN_CLAVE: las mismas con que se sembró la BD.
 */
const API = 'http://localhost:3000';

function variable(nombre: string): string {
  const valor = process.env[nombre];
  if (!valor) throw new Error(`Falta ${nombre}: exporta la misma clave con la que se ejecutó el seed.`);
  return valor;
}

const CUENTAS = {
  jefe: { correo: 'jefe@circadiano.local', inicio: /\/turnos$/ },
  despachador: { correo: 'despachador@circadiano.local', inicio: /\/despacho$/ },
  trabajador: { correo: 'trabajador1@circadiano.local', inicio: /\/plan$/ },
  administrador: { correo: '', inicio: /\/plataforma$/ },
};

const claveDe = (rol: keyof typeof CUENTAS) =>
  rol === 'administrador' ? variable('SEED_ADMIN_CLAVE') : variable('SEED_DEMO_CLAVE');
const correoDe = (rol: keyof typeof CUENTAS) =>
  rol === 'administrador' ? variable('SEED_ADMIN_CORREO') : CUENTAS[rol].correo;

async function ingresar(page: Page, rol: keyof typeof CUENTAS): Promise<void> {
  await page.goto('/ingresar');
  await page.getByLabel('Correo').fill(correoDe(rol));
  await page.getByLabel('Clave').fill(claveDe(rol));
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await expect(page).toHaveURL(CUENTAS[rol].inicio);
}

/** Mañana en hora de Lima (YYYY-MM-DD): el turno queda en el futuro y aparece como próximo. */
const mananaLima = () => new Date(Date.now() - 5 * 3_600_000 + 86_400_000).toISOString().slice(0, 10);

test.use({ viewport: { width: 390, height: 844 } });

let idTurnoCreado: string | undefined;

test.afterAll(async ({ request }) => {
  if (!idTurnoCreado) return;
  // Limpieza: si el turno queda, la siguiente corrida suma horas y RN01 respondería 409.
  const login = await request.post(`${API}/auth/login`, {
    data: { correo: CUENTAS.jefe.correo, clave: variable('SEED_DEMO_CLAVE') },
  });
  const { accessToken } = (await login.json()) as { accessToken: string };
  await request.delete(`${API}/operaciones/turnos/${idTurnoCreado}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
});

test('J01 asigna un turno a T01 desde la lista y T01 lo ve en su plan', async ({ page }) => {
  await ingresar(page, 'jefe');
  await expect(page.getByRole('navigation', { name: 'Navegación principal' }).getByRole('link')).toHaveText([
    'Turnos',
    'Indicadores',
  ]);

  await page.getByRole('button', { name: '+ Nuevo' }).click();
  const hoja = page.getByRole('dialog', { name: 'Nuevo turno' });
  await hoja.getByLabel('Trabajador').selectOption({ label: 'T01 · Conductor' });
  await hoja.getByLabel('Ruta').selectOption({ index: 1 });
  await hoja.getByLabel('Fecha').fill(mananaLima());
  await hoja.getByLabel('Inicio (hora Lima)').fill('07:15');
  await hoja.getByLabel('Fin (hora Lima)').fill('08:15');
  await hoja.getByLabel('Horas de conducción continua').fill('1');

  const [respuesta] = await Promise.all([
    page.waitForResponse((r) => r.url().endsWith('/operaciones/turnos') && r.request().method() === 'POST'),
    hoja.getByRole('button', { name: 'Guardar' }).click(),
  ]);
  expect(respuesta.status()).toBe(201);
  idTurnoCreado = ((await respuesta.json()) as { id: string }).id;
  await expect(hoja).toBeHidden();

  await page.getByRole('button', { name: 'Mi cuenta' }).click();
  await page.getByRole('button', { name: 'Cerrar sesión' }).click();
  await page.getByRole('button', { name: 'Sí, cerrar sesión' }).click();
  await expect(page).toHaveURL(/\/ingresar$/);

  await ingresar(page, 'trabajador');
  await expect(page.getByText('07:15 – 08:15')).toBeVisible();
});

for (const rol of Object.keys(CUENTAS) as (keyof typeof CUENTAS)[]) {
  test(`cerrar sesión como ${rol}: confirma, limpia el dispositivo y vuelve a /ingresar`, async ({ page }) => {
    await ingresar(page, rol);

    const boton = page.getByRole('button', { name: 'Mi cuenta' });
    await expect(boton).toHaveCSS('width', '48px');
    await expect(boton).toHaveCSS('height', '48px');
    await boton.click();
    const hoja = page.getByRole('dialog', { name: 'Mi cuenta' });
    await expect(hoja).toContainText('Código');
    await hoja.getByRole('button', { name: 'Cerrar sesión' }).click();
    await hoja.getByRole('button', { name: 'Sí, cerrar sesión' }).click();
    await expect(page).toHaveURL(/\/ingresar$/);

    expect(await page.evaluate(() => localStorage.getItem('circaruta-sesion'))).toBeNull();
    const filas = await page.evaluate(async () => {
      const db = await new Promise<IDBDatabase>((ok, mal) => {
        const req = indexedDB.open('ritmo-db');
        req.onsuccess = () => ok(req.result);
        req.onerror = () => mal(req.error);
      });
      const nombres = Array.from(db.objectStoreNames);
      if (nombres.length === 0) return 0;
      const tx = db.transaction(nombres, 'readonly');
      const conteos = await Promise.all(
        nombres.map(
          (n) =>
            new Promise<number>((ok) => {
              const req = tx.objectStore(n).count();
              req.onsuccess = () => ok(req.result);
            }),
        ),
      );
      return conteos.reduce((a, b) => a + b, 0);
    });
    expect(filas).toBe(0);

    // Sin sesión, una ruta protegida vuelve a pedir ingreso.
    await page.goto('/turnos');
    await expect(page).toHaveURL(/\/ingresar/);
  });
}
