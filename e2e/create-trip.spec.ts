import { test, expect } from '@playwright/test';

const AUTH_EMULATOR_URL = 'http://127.0.0.1:9099';

async function createAuthUser(email: string, password = 'testpass') {
  const signUpRes = await fetch(`${AUTH_EMULATOR_URL}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken: true })
  });
  const signUpJson = await signUpRes.json();

  // If the user already exists, sign them in to reuse the account.
  if (signUpJson?.error?.message === 'EMAIL_EXISTS') {
    const signInRes = await fetch(`${AUTH_EMULATOR_URL}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=fake-api-key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true })
    });
    return signInRes.json();
  }

  return signUpJson;
}

test.describe('Create trip from search modal (E2E)', () => {
  test('search modal selection opens editor and create trip persists document', async ({ page }) => {
    const userEmail = 'creator-flow@example.test';
    const password = 'testpass';
    await createAuthUser(userEmail, password);

    await page.goto('/');
    await page.evaluate(({ email, password }) => (window as any).__test_signInWithEmail({ email, password }), { email: userEmail, password });
    await page.waitForSelector('[data-testid="header-avatar"]');

    await page.evaluate(() => (window as any).__test_setVista('bitacora'));

    const addTripButton = page.getByRole('button', { name: /Add Trip|Registrar primera parada/i }).first();
    await addTripButton.click();
    await page.waitForSelector('text=Nuevo Destino');

    // Pick a hardcoded popular city to avoid external geocoding dependencies.
    await page.getByRole('button', { name: /Nueva York/i }).click();

    await page.waitForSelector('text=Photo Gallery');

    const createTripBtn = page.locator('button').filter({ hasText: /Crear viaje|Create Trip|button\.createTrip/i }).first();
    await createTripBtn.click({ force: true });

    await expect(page.locator('text=Tu bitacora aun no tiene paradas')).toHaveCount(0, { timeout: 15000 });
    await expect(page.locator('[data-testid^="bitacora-card-"]').first()).toBeVisible({ timeout: 15000 });
  });

  test('search modal country selection creates a trip', async ({ page }) => {
    const userEmail = 'creator-country@example.test';
    const password = 'testpass';
    await createAuthUser(userEmail, password);

    await page.goto('/');
    await page.evaluate(({ email, password }) => (window as any).__test_signInWithEmail({ email, password }), { email: userEmail, password });
    await page.waitForSelector('[data-testid="header-avatar"]');

    await page.evaluate(() => (window as any).__test_setVista('bitacora'));

    const addTripButton = page.getByRole('button', { name: /Add Trip|Registrar primera parada/i }).first();
    await addTripButton.click();
    await page.waitForSelector('text=Nuevo Destino');

    // Pick a hardcoded popular country to exercise the esPais=true path.
    await page.getByRole('button', { name: /Argentina/i }).click();

    await page.waitForSelector('text=Photo Gallery');

    const createTripBtn = page.locator('button').filter({ hasText: /Crear viaje|Create Trip|button\.createTrip/i }).first();
    await createTripBtn.click({ force: true });

    await expect(page.locator('text=Tu bitacora aun no tiene paradas')).toHaveCount(0, { timeout: 15000 });
    await expect(page.locator('[data-testid^="bitacora-card-"]').first()).toBeVisible({ timeout: 15000 });
  });
});
