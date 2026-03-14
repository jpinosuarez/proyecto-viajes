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

    await page.goto('/');
    await page.waitForFunction(() => typeof (window as any).__test_signInWithEmail === 'function');
    await page.evaluate(({ email, password }) => (window as any).__test_signInWithEmail({ email, password }), { email: userEmail, password });
    await page.waitForSelector('[data-testid="header-avatar"]');

    await page.goto('/trips');
    await page.waitForURL('**/trips');

    // Wait for trips list to load (grid or empty state)
    await page.waitForTimeout(2000); // give the UI time to settle

    // Open the search palette (new 2026 UX) via the header 'Add Trip' action
    const addTripBtn = page.getByRole('button', { name: /Add Trip|Crear viaje|Agregar viaje/i }).first();
    await addTripBtn.click();

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

    // Wait for the SearchPalette input to appear (aria-label="Search")
    const searchInput = page.getByRole('textbox', { name: 'Search', exact: true });
    await searchInput.waitFor({ state: 'visible', timeout: 10000 });

    // Type a destination and wait for the result to appear
    await searchInput.fill('New York');

    // Wait for results list to contain the destination and click it
    const result = page.getByText(/New York/i).first();
    await result.waitFor({ state: 'visible', timeout: 10000 });
    await result.click();

    // Wait for the editor to open (title input should appear)
    const titleInput = page.getByPlaceholder(/trip title|título del viaje/i);
    await titleInput.waitFor({ state: 'visible', timeout: 10000 });

    // Provide a title and save
    await titleInput.fill('E2E Trip');
    const saveBtn = page.getByRole('button', { name: /Save|Guardar|Crear viaje/i }).first();
    await saveBtn.click();

    // Wait for the editor to close and the trip to appear in the grid
    await expect(page.locator('text=E2E Trip')).toHaveCount(1, { timeout: 20000 });

    // Wait for the modal to close and trip to be created
    await page.waitForTimeout(3000);

    // Close any celebration modals that appear
    const closeModals = async () => {
      // Close level-up modal
      const levelUpModal = page.locator('text=New Level!');
      if (await levelUpModal.isVisible({ timeout: 1000 }).catch(() => false)) {
        await page.getByRole('button', { name: 'Next →' }).click();
        await page.waitForTimeout(500);
      }

      // Close achievement modal
      const achievementModal = page.locator('text=Achievement unlocked!');
      if (await achievementModal.isVisible({ timeout: 1000 }).catch(() => false)) {
        await page.getByRole('button', { name: 'Great! 🎉' }).click();
        await page.waitForTimeout(500);
      }
    };

    // Close modals multiple times in case multiple achievements trigger
    await closeModals();
    await closeModals();
    await closeModals();

    // Force a page reload to ensure Firestore listeners update
    await page.reload();
    await page.waitForSelector('[data-testid="header-avatar"]');
    await page.goto('/trips');
    await page.waitForURL('**/trips');
    await page.waitForTimeout(2000);

    await expect(page.locator('text=Your logbook has no stops yet')).toHaveCount(0, { timeout: 15000 });
    await expect((await page.locator('[data-testid^="trip-card-"]').count())).toBeGreaterThan(0);
  });

  test.skip('search modal country selection creates a trip', async ({ page }) => {
    const timestamp = Date.now();
    const userEmail = `creator-country-${timestamp}@example.test`;
    const password = 'testpass';
    await createAuthUser(userEmail, password);

    await page.goto('/');
    await page.waitForFunction(() => typeof (window as any).__test_signInWithEmail === 'function');
    await page.evaluate(({ email, password }) => (window as any).__test_signInWithEmail({ email, password }), { email: userEmail, password });
    await page.waitForSelector('[data-testid="header-avatar"]');

    await page.goto('/trips');
    await page.waitForURL('**/trips');

    const addTripButton = page.getByRole('button', { name: /Add Trip|Register first stop|Registrar primera parada/i }).first();
    await addTripButton.click();
    await page.waitForSelector('text=Search destinationsions');

    // Pick a hardcoded popular country to exercise the esPais=true path.
    await page.getByRole('button', { name: /Argentina/i }).click();

    await page.waitForSelector('text=Photo Gallery');

    const createTripBtn = page.locator('button').filter({ hasText: /Crear viaje|Create Trip|button\.createTrip/i }).first();
    await createTripBtn.click({ force: true });

    await expect(page.locator('text=Your logbook has no stops yet')).toHaveCount(0, { timeout: 15000 });
    await expect(page.locator('[data-testid^="trip-card-"]')).toHaveCount(1, { timeout: 15000 });
  });
});
