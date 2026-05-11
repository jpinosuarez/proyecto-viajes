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

function decodePayload(payload: string | null) {
  if (!payload) return '';
  try {
    return decodeURIComponent(payload);
  } catch {
    return payload;
  }
}

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

async function setOperationalLevel(page: Page, level: number) {
  // Use the standard REST API but with the 'owner' token which the emulator recognizes as admin
  const url = `http://${FIRESTORE_EMULATOR_HOST}/v1/projects/${FIRESTORE_PROJECT_ID}/databases/(default)/documents/system/operational_flags`;
  
  console.log(`[E2E] Setting operational level to ${level} via REST Admin (Bearer owner)...`);
  
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer owner'
    },
    body: JSON.stringify(toFirestoreDocument(level)),
  });

  if (!response.ok) {
    const responseText = await response.text();
    console.error(`[E2E] Failed to set operational level ${level}. Status: ${response.status}, Body: ${responseText}`);
    // If REST fails, fallback to the founder dance (but we need to fix it)
    throw new Error(`Could not set operational level ${level}: ${response.status} ${responseText}`);
  }
  
  console.log(`[E2E] Operational level ${level} set successfully. Waiting for app to reflect change...`);
  // Give the app a moment to receive the snapshot
  await page.waitForTimeout(1000);
}

async function navigateInApp(page: Page, path: string) {
  const baseURL = 'http://localhost:5173';
  await page.goto(`${baseURL}${path}`);
}

async function openSearchPalette(page: Page) {
  // Try keyboard shortcuts first
  await page.keyboard.press('Control+k');
  await page.keyboard.press('Meta+k');
  
  // Also try clicking any search-looking button as fallback
  const searchTrigger = page.locator('button:has-text("Search"), button:has-text("Buscar"), [aria-label*="Search"], [aria-label*="Buscar"]').first();
  if (await searchTrigger.isVisible()) {
    await searchTrigger.click();
  }

  const searchInput = page
    .getByPlaceholder(/Type a country|Escribe un pa|Search places|trips|ciudad|destinos/i)
    .first();
  
  await expect(searchInput).toBeVisible({ timeout: 30000 });
  return searchInput;
}

test.describe('Unified kill-switch operational audit', () => {
  test.afterEach(async ({ page }) => {
    await setOperationalLevel(page, 0);
  });

  test('L1 Soft Kill: city search sends exactly zero Mapbox geocoding requests', async ({ page }) => {
    const timestamp = Date.now();
    const email = `kill-l1-${timestamp}@example.test`;
    const password = 'testpass';

    await createAuthUser(email, password);
    await setOperationalLevel(page, 1);

    let geocodingRequestCount = 0;
    page.on('request', (request) => {
      if (MAPBOX_GEOCODING_URL_PATTERN.test(request.url())) {
        geocodingRequestCount += 1;
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await stabilizeAuthenticatedSession(page, email, password);
    await page.waitForTimeout(2000);
    
    const searchInput = await openSearchPalette(page);
    await expect(searchInput).toBeDisabled({ timeout: 10000 });

    await expect(page.getByText(SEARCH_PAUSED_COPY_PATTERN).first()).toBeVisible({ timeout: 15000 });
    await page.waitForTimeout(1200);
    expect(geocodingRequestCount).toBe(0);
  });

  test('L2 Hard Kill: map route sends zero Mapbox tile/style requests and renders fallback', async ({ page }) => {
    const timestamp = Date.now();
    const email = `kill-l2-${timestamp}@example.test`;
    const password = 'testpass';

    await createAuthUser(email, password);
    await setOperationalLevel(page, 2);

    let mapboxTileStyleRequestCount = 0;
    page.on('request', (request) => {
      if (MAPBOX_TILE_STYLE_URL_PATTERN.test(request.url())) {
        mapboxTileStyleRequestCount += 1;
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await stabilizeAuthenticatedSession(page, email, password);
    await page.waitForTimeout(2000);

    // Navigate to map
    await navigateInApp(page, '/map');
    await page.waitForTimeout(3000); // Allow time for level 2 flag to propagate and render fallback
    
    await expect(page).toHaveURL(/\/map(?:\?.*)?$/);
    const fallbackText = page.getByText(MAP_FALLBACK_COPY_PATTERN).first();
    await expect(fallbackText).toBeVisible({ timeout: 25000 });

    await page.waitForTimeout(1500);
    expect(mapboxTileStyleRequestCount).toBe(0);
  });

  test('L3 Operation: bitacora is READ-ONLY', async ({ page }) => {
    const timestamp = Date.now();
    const email = `kill-l3-${timestamp}@example.test`;
    const password = 'testpass';

    await createAuthUser(email, password);
    await setOperationalLevel(page, 3);

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await stabilizeAuthenticatedSession(page, email, password);
    await page.waitForTimeout(2000);

    await navigateInApp(page, '/trips');
    await expect(page).toHaveURL(/\/trips(?:\?.*)?$/);
    
    // Check if some edit-related buttons are gone or disabled
    const addTripBtn = page.getByTestId('add-trip-button');
    if (await addTripBtn.isVisible()) {
      await expect(addTripBtn).toBeDisabled();
    }
  });

  test('L4 Total Halt: app renders global maintenance mode barrier', async ({ page }) => {
    const timestamp = Date.now();
    const email = `kill-l4-${timestamp}@example.test`;
    const password = 'testpass';

    await createAuthUser(email, password);
    await setOperationalLevel(page, 4);

    let firestoreTripFetchRequestCount = 0;

    page.on('request', (request) => {
      if (!FIRESTORE_REQUEST_URL_PATTERN.test(request.url())) return;

      const payload = decodePayload(request.postData());
      if (TRIP_PATH_PATTERN.test(payload)) {
        firestoreTripFetchRequestCount += 1;
      }
    });

    await page.goto('/');
    await page.waitForLoadState('load');
    await signInInBrowser(page, email, password);

    await expect(page.getByText(MAINTENANCE_COPY_PATTERN).first()).toBeVisible({ timeout: 15000 });
    await page.waitForTimeout(1500);

    expect(firestoreTripFetchRequestCount).toBe(0);
  });
});
