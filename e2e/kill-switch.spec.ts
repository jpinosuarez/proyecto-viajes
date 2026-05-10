import { test, expect, type Page } from '@playwright/test';
import { createAuthUser, signInInBrowser, stabilizeAuthenticatedSession } from './utils/e2e-auth';
const FIRESTORE_PROJECT_ID = 'keeptrip-app-b06b3';
const FIRESTORE_EMULATOR_HOST = process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8081';
const OPERATIONAL_FLAGS_DOC_URL = `http://${FIRESTORE_EMULATOR_HOST}/v1/projects/${FIRESTORE_PROJECT_ID}/databases/(default)/documents/system/operational_flags`;

const MAPBOX_GEOCODING_URL_PATTERN = /api\.mapbox\.com\/geocoding\//i;
const MAPBOX_TILE_STYLE_URL_PATTERN = /api\.mapbox\.com\/(styles\/v1|v4\/|raster\/v1|fonts\/v1)/i;
const FIRESTORE_REQUEST_URL_PATTERN = /google\.firestore\.v1\.Firestore\/(Listen|RunQuery|BatchGetDocuments|Commit|Write)/i;
const TRIP_PATH_PATTERN = /(\"viajes\"|\/viajes\/|collectionId\":\"viajes\")/i;

const MAINTENANCE_COPY_PATTERN = /Explorer's Rest|Modo mantenimiento|Maintenance Mode/i;
const MAP_FALLBACK_COPY_PATTERN = /Interactive maps are resting|mapas interactivos estan en pausa|mapas interactivos est[aá]n en pausa/i;
const SEARCH_PAUSED_COPY_PATTERN = /Search temporarily paused|Búsqueda temporalmente pausada/i;

function toFirestoreDocument(level: number) {
  return {
    fields: {
      level: { integerValue: String(level) },
      app_readonly_mode: { booleanValue: level >= 3 },
      app_maintenance_mode: { booleanValue: level >= 4 },
      reason: { stringValue: `E2E kill-switch level ${level}` },
    },
  };
}

async function setOperationalLevel(level: number) {
  const response = await fetch(OPERATIONAL_FLAGS_DOC_URL, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer owner',
    },
    body: JSON.stringify(toFirestoreDocument(level)),
  });

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(`Could not set operational level ${level}: ${response.status} ${responseText}`);
  }
}



async function openSearchPalette(page: Page) {
  await page.waitForFunction(() => typeof (window as any).__test_abrirSearchPalette === 'function');
  await page.evaluate(() => (window as any).__test_abrirSearchPalette());

  // Try locating by role first (aria-label="Search" or localized)
  const searchInputByRole = page.getByRole('textbox', { name: /Search|Buscar|destinos/i }).first();
  try {
    await searchInputByRole.waitFor({ state: 'visible', timeout: 5000 });
    return searchInputByRole;
  } catch (e) {
    // Fallback to placeholder if role fails
    const searchInputByPlaceholder = page
      .getByPlaceholder(/Type a country|Escribe un pa|Search places|trips|ciudad/i)
      .first();

    await expect(searchInputByPlaceholder).toBeVisible({ timeout: 15000 });
    return searchInputByPlaceholder;
  }
}

function decodePayload(payload: string | null) {
  if (!payload) return '';
  try {
    return decodeURIComponent(payload);
  } catch {
    return payload;
  }
}

test.describe('Unified kill-switch operational audit', () => {
  test.afterEach(async () => {
    await setOperationalLevel(0);
  });

  test('L1 Soft Kill: city search sends exactly zero Mapbox geocoding requests', async ({ page }) => {
    const timestamp = Date.now();
    const email = `kill-l1-${timestamp}@example.test`;
    const password = 'testpass';

    await createAuthUser(email, password);
    await setOperationalLevel(1);

    let geocodingRequestCount = 0;
    page.on('request', (request) => {
      if (MAPBOX_GEOCODING_URL_PATTERN.test(request.url())) {
        geocodingRequestCount += 1;
      }
    });

    await page.goto('/');
    await stabilizeAuthenticatedSession(page, email, password);

    const searchInput = await openSearchPalette(page);
    await expect(searchInput).toBeVisible({ timeout: 15000 });
    await expect(searchInput).toBeDisabled();

    await expect(page.getByText(SEARCH_PAUSED_COPY_PATTERN).first()).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(1200);

    expect(geocodingRequestCount).toBe(0);
  });

  test('L2 Hard Kill: map route sends zero Mapbox tile/style requests and renders fallback', async ({ page }) => {
    const timestamp = Date.now();
    const email = `kill-l2-${timestamp}@example.test`;
    const password = 'testpass';

    await createAuthUser(email, password);
    await setOperationalLevel(2);

    let mapboxTileStyleRequestCount = 0;
    page.on('request', (request) => {
      if (MAPBOX_TILE_STYLE_URL_PATTERN.test(request.url())) {
        mapboxTileStyleRequestCount += 1;
      }
    });

    await page.goto('/');
    await stabilizeAuthenticatedSession(page, email, password);

    await page.waitForFunction(() => typeof (window as any).__test_navigate === 'function');
    await page.evaluate(() => (window as any).__test_navigate('/map'));

    await expect(page).toHaveURL(/\/map(?:\?.*)?$/);
    await expect(page.getByText(MAP_FALLBACK_COPY_PATTERN).first()).toBeVisible({ timeout: 15000 });

    await page.waitForTimeout(1500);
    expect(mapboxTileStyleRequestCount).toBe(0);
  });

  test('L4 Blackout: maintenance screen is visible and no trip reads are requested', async ({ page }) => {
    const timestamp = Date.now();
    const email = `kill-l4-${timestamp}@example.test`;
    const password = 'testpass';

    await createAuthUser(email, password);
    await setOperationalLevel(4);

    let firestoreTripFetchRequestCount = 0;

    page.on('request', (request) => {
      if (!FIRESTORE_REQUEST_URL_PATTERN.test(request.url())) return;

      const payload = decodePayload(request.postData());
      if (TRIP_PATH_PATTERN.test(payload)) {
        firestoreTripFetchRequestCount += 1;
      }
    });

    await page.goto('/');
    await signInInBrowser(page, email, password);

    await expect(page.getByText(MAINTENANCE_COPY_PATTERN).first()).toBeVisible({ timeout: 15000 });
    await page.waitForTimeout(1500);

    expect(firestoreTripFetchRequestCount).toBe(0);
  });
});
