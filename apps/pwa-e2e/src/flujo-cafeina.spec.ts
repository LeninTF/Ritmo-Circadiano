import { expect, test, type Page } from '@playwright/test';

/** Registro → login → registrar café → ver mi consumo (SPEC.md §10, HU-01 a HU-05). */

const CLAVE = 'Ruta2026e2e';

async function crearCuentaEIngresar(page: Page): Promise<void> {
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
}

test('flujo feliz: registrar 2 cafés, verlos en «Mi consumo» y eliminarlos', async ({ page }) => {
  await crearCuentaEIngresar(page);

  await page.getByRole('link', { name: 'Cafeína' }).click();
  await expect(page.getByRole('heading', { name: 'Mi consumo' })).toBeVisible();
  await expect(page.getByText('Aún no registras consumos. Empieza con tu primer café.')).toBeVisible();
  await expect(page.getByText('Estimación aproximada, no es un dato médico.')).toBeVisible();

  await page.getByRole('link', { name: 'Registrar café' }).click();
  await page.getByRole('button', { name: /Café pasado/ }).click();
  await page.getByRole('button', { name: 'Agregar una porción' }).click();
  await expect(page.locator('.cifra-heroe')).toHaveText('190');
  await page.getByRole('button', { name: 'Guardar' }).click();

  await expect(page).toHaveURL(/\/cafeina$/);
  await expect(page.getByText('Café registrado.')).toBeVisible();
  await expect(page.getByText('190 mg · 1 registro')).toBeVisible();
  await expect(page.getByRole('listitem', { name: 'Hoy: 190 mg' })).toBeVisible();
  await expect(page.getByText(/de cafeína activa/)).toBeVisible();

  page.once('dialog', (dialogo) => void dialogo.accept());
  await page.getByRole('button', { name: /^Eliminar Café pasado/ }).click();

  await expect(page.getByText('Registro eliminado.')).toBeVisible();
  await expect(page.getByText('Aún no registras consumos. Empieza con tu primer café.')).toBeVisible();
  await expect(page.getByText('0 mg · 0 registros')).toBeVisible();
});

test('sin señal: el café queda pendiente en el teléfono y se envía al volver la señal', async ({ page, context }) => {
  await crearCuentaEIngresar(page);
  await page.getByRole('link', { name: 'Cafeína' }).click();
  await page.getByRole('link', { name: 'Registrar café' }).click();
  await expect(page.getByRole('button', { name: /Café pasado/ })).toBeVisible();

  await context.setOffline(true);
  await page.getByRole('button', { name: /Café pasado/ }).click();
  await page.getByRole('button', { name: 'Guardar' }).click();

  await expect(page.getByText('Guardado en tu teléfono. Se enviará cuando tengas señal.')).toBeVisible();
  await expect(page.getByText('Sin señal: calculado con lo registrado en este teléfono.')).toBeVisible();
  await expect(page.getByText('95 mg · Pendiente de enviar')).toBeVisible();
  await expect(page.getByText('95 mg · 1 registro')).toBeVisible();

  await context.setOffline(false);
  // La cola sincroniza con el evento online; se recarga hasta que el servidor lo cuente.
  await expect(async () => {
    await page.reload();
    await expect(page.getByText('95 mg · 1 registro')).toBeVisible({ timeout: 2_000 });
    await expect(page.getByText('Pendiente de enviar')).toHaveCount(0);
    await expect(page.getByText(/Sin señal/)).toHaveCount(0);
  }).toPass({ timeout: 30_000 });
});
