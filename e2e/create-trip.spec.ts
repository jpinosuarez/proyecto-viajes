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
    const timestamp = Date.now();
    const userEmail = `creator-flow-${timestamp}@example.test`;
    const password = 'testpass';
    await createAuthUser(userEmail, password);

    const consoleWarnings = [];
    page.on('console', (message) => {
      if (['warning', 'error', 'log'].includes(message.type())) {
        consoleWarnings.push(`[${message.type()}] ${message.text()}`);
      }
    });

    await page.goto('/');
    await page.waitForFunction(() => typeof (window as any).__test_signInWithEmail === 'function');
    await page.evaluate(({ email, password }) => (window as any).__test_signInWithEmail({ email, password }), { email: userEmail, password });
    await page.waitForSelector('[data-testid="header-avatar"]');

    // Assert no overflow style conflict warning appears
    await expect(consoleWarnings).not.toContainEqual(expect.stringContaining('Updating a style property during rerender (overflow)'));


    await page.goto('/trips');
    await page.waitForURL('**/trips');

    // Session can occasionally bounce to landing in emulator boot races.
    // If that happens, sign in again and retry /trips before continuing.
    const isOnLanding = await page.getByRole('button', { name: /Log In|Iniciar sesion|Iniciar sesión/i }).count();
    if (isOnLanding > 0) {
      await page.waitForFunction(() => typeof (window as any).__test_signInWithEmail === 'function');
      await page.evaluate(({ email, password }) => (window as any).__test_signInWithEmail({ email, password }), { email: userEmail, password });
      await page.waitForSelector('[data-testid="header-avatar"]');
      await page.goto('/trips');
      await page.waitForURL('**/trips');
    }

    // Wait for trips list to load (grid or empty state)
    await page.waitForTimeout(2000); // give the UI time to settle

    // Refresh auth session once more before interacting with the search palette.
    await page.waitForFunction(() => typeof (window as any).__test_signInWithEmail === 'function');
    await page.evaluate(({ email, password }) => (window as any).__test_signInWithEmail({ email, password }), { email: userEmail, password });
    await page.waitForSelector('[data-testid="header-avatar"]');
    await page.goto('/trips');
    await page.waitForURL('**/trips');

    // Open the search palette (new 2026 UX). Prefer the Add Trip CTA; fallback to test helper.
    await page.evaluate(() => (window as any).__test_abrirSearchPalette?.());
    const addTripBtn = page.getByRole('button', { name: /Add Trip|Crear viaje|Agregar viaje/i }).first();
    if (await addTripBtn.count() > 0) {
      const isSearchVisible = await page.getByRole('textbox', { name: /Search|Buscar/i }).first().isVisible().catch(() => false);
      if (!isSearchVisible) {
        await addTripBtn.click();
      }
    }

    // Intercept Mapbox API to avoid external dependency and return a stable result
    await page.route('https://api.mapbox.com/**', (route) => {
      const fakeGeoJson = {
        type: 'FeatureCollection',
        query: ['new', 'york'],
        features: [
          {
            id: 'place.123',
            type: 'Feature',
            place_type: ['place'],
            text: 'New York',
            place_name: 'New York, New York, United States',
            center: [-74.006, 40.7128],
            properties: {},
            context: [
              { id: 'country.usa', text: 'United States', short_code: 'us' },
            ],
          },
        ],
      };
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(fakeGeoJson),
      });
    });

    // Wait for the SearchPalette input to appear (label can change with active locale)
    const searchInput = page.getByRole('textbox', { name: /Search|Buscar/i }).first();
    await searchInput.waitFor({ state: 'visible', timeout: 10000 });

    // Type a destination and wait for the result to appear
    await searchInput.fill('New York');

    // Wait for the first search result to appear and click it
    const resultCard = page.locator('[data-testid^="search-result-place-"]').first();
    await expect(resultCard).toContainText(/New York/i, { timeout: 10000 });
    await resultCard.click();

    // Wait for the editor to open (trip title input should appear)
    await page.waitForTimeout(1000);
    const allInputs = await page.$$('input');
    console.log('DEBUG all inputs count:', allInputs.length);
    for (const input of allInputs) {
      const name = await input.getAttribute('name');
      const placeholder = await input.getAttribute('placeholder');
      const value = await input.inputValue();
      console.log('DEBUG input', {name, placeholder, value});
    }

    const titleInput = page.getByPlaceholder(/Trip Title|Título del viaje/i);
    await expect(titleInput).toBeVisible({ timeout: 10000 });

    // Validate sticky top action bar is visible and title is auto-populated from search selection
    await expect(page.getByRole('button', { name: /Cancel|Cancelar/i }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Save|Guardar/i }).first()).toBeVisible();
    await expect(titleInput).not.toHaveValue('');
    await expect(titleInput).toHaveValue(/Escapada a New York|New York|E2E Trip/);
    const citySearchInput = page.getByPlaceholder(/Type the city name|Escribe el nombre de la ciudad/i).first();
    if (await citySearchInput.count() > 0) {
      await citySearchInput.fill('Paris');
      // Wait for results and verify the CTA text
      const cityAddBtn = page.getByRole('button', { name: /Agregar|Add/ }).first();
      await expect(cityAddBtn).toBeVisible({ timeout: 10000 });
      await expect(cityAddBtn).toContainText(/Agregar|Add/);
    }

    // Ensure no raw key jargon fallback text is exposed in the UI
    await expect(page.locator('text=button.add')).toHaveCount(0);
    await expect(page.locator('text=common:add')).toHaveCount(0);

    // Verify gallery cover info text has been updated
    await expect(page.getByText(/Esta imagen será la foto de portada del viaje|For now, we only allow 1 cover photo for your trip/)).toBeVisible({ timeout: 10000 });

    // Provide a title and save
    await titleInput.fill('E2E Trip');
    const saveBtn = page.getByRole('button', { name: /Save|Guardar/i }).first();
    await saveBtn.click();

    // Wait for the editor to close and the trip to appear in the grid
    await expect(page.getByRole('button', { name: /E2E Trip/i }).first()).toBeVisible({ timeout: 20000 });

    // Wait for the modal to close and trip to be created
    await page.waitForTimeout(3000);

    // Close any celebration modals that appear
    const closeModals = async () => {
      // Close level-up modal
      const levelUpModal = page.locator('text=New Level!');
      if (await levelUpModal.isVisible({ timeout: 1000 }).catch(() => false)) {
        await page.getByRole('button', { name: /Next|Siguiente/i }).first().click();
        await page.waitForTimeout(500);
      }

      // Close achievement modal
      const achievementModal = page.locator('text=Achievement unlocked!');
      if (await achievementModal.isVisible({ timeout: 1000 }).catch(() => false)) {
        await page.getByRole('button', { name: /Great|Genial|Excelente/i }).first().click();
        await page.waitForTimeout(500);
      }

      // Close expedition summary modal (appears on big unlock bursts)
      const expeditionModal = page.locator('text=Expedition Summary!');
      if (await expeditionModal.isVisible({ timeout: 1000 }).catch(() => false)) {
        await page.getByRole('button', { name: /Amazing|Increíble|Asombroso/i }).first().click();
        await page.waitForTimeout(500);
      }
    };

    // Close modals multiple times in case multiple achievements trigger
    await closeModals();
    await closeModals();
    await closeModals();

    // Ensure the trip list is reactive without forcing a hard reload.
    await expect(page.locator('text=Your logbook has no stops yet')).toHaveCount(0, { timeout: 5000 });
    await expect(page.locator('[data-testid^="trip-card-"]')).toHaveCount(1, { timeout: 5000 });

    await closeModals();

    // Open the newly created trip using query param by extracting its ID from the displayed card.
    const createdTripCard = page.locator('[data-testid^="trip-card-"]').first();
    const createdTripTestId = await createdTripCard.getAttribute('data-testid');
    const createdTripId = createdTripTestId?.replace('trip-card-', '');
    expect(createdTripId).toBeTruthy();

    await page.goto(`/trips?editing=${createdTripId}`);
    const existingTitleInput = page.getByPlaceholder(/Trip Title|Título del viaje/i);
    await expect(existingTitleInput).toBeVisible({ timeout: 10000 });

    await expect(existingTitleInput).not.toHaveValue('');

    // Update title to ensure changes persist and UI reflects update
    await existingTitleInput.fill('E2E Trip Edited');
    const saveUpdatedBtn = page.getByRole('button', { name: /Save|Guardar/i }).first();
    await saveUpdatedBtn.click();
    await expect(page.getByRole('button', { name: /E2E Trip Edited/i }).first()).toBeVisible({ timeout: 15000 });
  });
});
