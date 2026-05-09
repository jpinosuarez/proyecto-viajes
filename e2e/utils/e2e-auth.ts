import { expect, type Page } from '@playwright/test';

const AUTH_EMULATOR_URL = 'http://127.0.0.1:9099';

export async function createAuthUser(email: string, password = 'testpass') {
  const signUpResponse = await fetch(
    `${AUTH_EMULATOR_URL}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    }
  );
  const signUpJson = await signUpResponse.json();

  if (signUpJson?.error?.message === 'EMAIL_EXISTS') {
    const signInResponse = await fetch(
      `${AUTH_EMULATOR_URL}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=fake-api-key`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      }
    );
    return signInResponse.json();
  }

  return signUpJson;
}

export async function e2eInitStorage(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
}

export async function mockAuthFlow(page: Page) {
  await page.route('https://api.mapbox.com/geocoding/**', async (route) => {
    const fakeGeoJson = {
      type: 'FeatureCollection',
      query: ['madrid'],
      features: [
        {
          id: 'place.madrid',
          type: 'Feature',
          place_type: ['place'],
          text: 'Madrid',
          place_name: 'Madrid, Comunidad de Madrid, España',
          center: [-3.7038, 40.4168],
          properties: {},
          context: [{ id: 'country.esp', text: 'España', short_code: 'es' }],
        },
      ],
    };

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(fakeGeoJson),
    });
  });
}

export async function e2ePerformLogin(page: Page) {
  const email = `e2e-${Date.now()}@example.test`;
  const password = 'testpass';
  await createAuthUser(email, password);

  // Attach diagnostics listeners to capture console, errors, and failed requests during CI runs
  const consoleMessages: string[] = [];
  const pageErrors: string[] = [];
  const failedRequests: string[] = [];

  const onConsole = (msg: any) => consoleMessages.push(`${msg.type()}: ${msg.text()}`);
  const onPageError = (err: any) => pageErrors.push(String(err));
  const onRequestFailed = (req: any) => failedRequests.push(`${req.method()} ${req.url()} ${req.failure()?.errorText || ''}`);

  page.on('console', onConsole);
  page.on('pageerror', onPageError);
  page.on('requestfailed', onRequestFailed);

  await page.goto('/');

  // Wait for test helper to be injected and retry sign-in a few times if needed
  const helperTimeout = 20000;
  await page.waitForFunction(() => typeof (window as any).__test_signInWithEmail === 'function', { timeout: helperTimeout });

  let signed = false;
  for (let attempt = 0; attempt < 4 && !signed; attempt += 1) {
    try {
      await page.evaluate(
        ({ loginEmail, loginPassword }) =>
          (window as any).__test_signInWithEmail({ email: loginEmail, password: loginPassword }),
        { loginEmail: email, loginPassword: password }
      );

      // Give the app time to process login and render the avatar
      await expect(page.getByTestId('header-avatar')).toBeVisible({ timeout: 30000 });
      signed = true;
      break;
    } catch (err) {
      // If the avatar didn't appear, wait a bit and retry
      // capture a snapshot of console and errors for debugging in CI
      // eslint-disable-next-line no-console
      console.warn('Sign-in attempt failed, retrying...', { attempt, error: String(err) });
      await page.waitForTimeout(1500 + attempt * 1000);
    }
  }

  if (!signed) {
    // Dump diagnostics to help CI triage
    // eslint-disable-next-line no-console
    console.error('E2E Sign-in failed. Console messages:', consoleMessages.slice(-50));
    // eslint-disable-next-line no-console
    console.error('E2E Page errors:', pageErrors.slice(-20));
    // eslint-disable-next-line no-console
    console.error('E2E Failed requests:', failedRequests.slice(-20));
    // Final attempt: assert to fail the test with diagnostics
    await expect(page.getByTestId('header-avatar')).toBeVisible({ timeout: 20000 });
  }

  // cleanup listeners
  page.removeListener('console', onConsole);
  page.removeListener('pageerror', onPageError);
  page.removeListener('requestfailed', onRequestFailed);
}

// Robust sign-in helper exported for specs to use
export async function signInInBrowser(page: Page, email: string, password = 'testpass') {
  await page.waitForFunction(() => typeof (window as any).__test_signInWithEmail === 'function', { timeout: 20000 });
  await page.evaluate(({ email: e, password: p }) => (window as any).__test_signInWithEmail({ email: e, password: p }), { email, password });
  await expect(page.getByTestId('header-avatar')).toBeVisible({ timeout: 30000 });
}

export async function stabilizeAuthenticatedSession(page: Page, email: string, password = 'testpass') {
  const loginVisible = await page.getByRole('button', { name: /Log In|Iniciar sesion|Iniciar sesión/i }).count();
  if (loginVisible > 0) {
    await signInInBrowser(page, email, password);
  }
  await expect(page.getByTestId('header-avatar')).toBeVisible({ timeout: 30000 });

export async function e2eCleanupTrip(_page: Page, _tripId: string) {
  // No-op by design: emulator session is ephemeral for CI and local e2e runs.
}
