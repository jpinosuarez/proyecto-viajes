import { expect, type Page } from '@playwright/test';

const AUTH_EMULATOR_URL = 'http://127.0.0.1:9099';

export async function createAuthUser(email: string, password = 'testpass', localId?: string) {
  console.log(`[E2E] Creating auth user ${email} (UID: ${localId || 'auto'})...`);
  const signUpResponse = await fetch(
    `${AUTH_EMULATOR_URL}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ localId, email, password, returnSecureToken: true }),
    }
  );
  const signUpJson = await signUpResponse.json();

  if (signUpJson?.error?.message === 'EMAIL_EXISTS' || signUpJson?.error?.message === 'ID_EXISTS') {
    console.log(`[E2E] User ${email} or UID ${localId} already exists, ensuring password match...`);
    // Note: in emulator, we can just proceed. If password differs, it might fail later.
    // We could call signInWithPassword here to get the UID if needed.
    const signInResponse = await fetch(
      `${AUTH_EMULATOR_URL}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=fake-api-key`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      }
    );
    const signInJson = await signInResponse.json();
    return signInJson;
  }

  if (signUpJson.error) {
    console.error(`[E2E] Failed to create user ${email}:`, signUpJson.error);
  }

  console.log(`[E2E] User ${email} created/ready. UID: ${signUpJson.localId}`);
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

  const waitForFirebaseAuthSession = async () => {
    await page.waitForFunction(() => {
      try {
        return Object.keys(window.localStorage).some((key) => key.startsWith('firebase:authUser:'));
      } catch (err) {
        return false;
      }
    }, { timeout: 30000 });

    await expect(page.getByTestId('header-login-button')).toHaveCount(0, { timeout: 30000 });
  };

  // Helper: consider sign-in successful when either the header avatar becomes visible
  // or Firebase Auth currentUser is available in the page context. This avoids flakiness
  // where UI avatar is hidden by styling/animations while auth state is already set.
  const checkAuthReady = async () => {
    return page.evaluate(() => {
      try {
        // Prefer direct Firebase Auth if available
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const fb = (window as any).firebase;
        const auth = fb?.auth?.();
        if (auth && auth.currentUser) return { auth: true, uid: auth.currentUser.uid };
      } catch (e) {
        // ignore
      }
      const avatar = document.querySelector('[data-testid="header-avatar"]');
      if (avatar) {
        const style = window.getComputedStyle(avatar as Element);
        const visible = style && style.visibility !== 'hidden' && style.display !== 'none' && (avatar as HTMLElement).offsetParent !== null;
        return { avatarPresent: true, avatarVisible: !!visible };
      }
      return { auth: false };
    });
  };

  let signed = false;
  for (let attempt = 0; attempt < 6 && !signed; attempt += 1) {
    try {
      await page.evaluate(
        ({ loginEmail, loginPassword }) =>
          (window as any).__test_signInWithEmail({ email: loginEmail, password: loginPassword }),
        { loginEmail: email, loginPassword: password }
      );

      await waitForFirebaseAuthSession();
      signed = true;

      if (signed) break;
      // otherwise fallthrough to retry
    } catch (err) {
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
    // Final attempt: assert to fail the test with diagnostics (try auth existence first)
    const finalStatus = await page.evaluate(() => {
      try {
        return Object.keys(window.localStorage).some((key) => key.startsWith('firebase:authUser:'));
      } catch (e) {
        return false;
      }
    });
    if (!finalStatus) {
      await expect(page.getByTestId('header-login-button')).toHaveCount(0, { timeout: 20000 });
    }
  }

  // cleanup listeners
  page.removeListener('console', onConsole);
  page.removeListener('pageerror', onPageError);
  page.removeListener('requestfailed', onRequestFailed);
}

// Robust sign-in helper exported for specs to use
export async function signInInBrowser(page: Page, email: string, password = 'testpass') {
  console.log(`[E2E] Signing in as ${email}...`);
  try {
    await page.waitForFunction(() => typeof (window as any).__test_signInWithEmail === 'function', { timeout: 30000 });
  } catch (err) {
    console.error(`[E2E] Test helper __test_signInWithEmail not found on page. Current URL: ${page.url()}`);
    throw err;
  }

  let signInResult = false;
  for (let i = 0; i < 5; i++) {
    signInResult = await page.evaluate(({ email: e, password: p }) => (window as any).__test_signInWithEmail({ email: e, password: p }), { email, password });
    if (signInResult) break;
    console.warn(`[E2E] Sign-in attempt ${i+1} for ${email} failed, retrying in 2s...`);
    await page.waitForTimeout(2000);
  }

  if (signInResult === false) {
    throw new Error(`Test sign-in helper returned false for ${email} after 5 attempts`);
  }

  console.log(`[E2E] Sign-in call successful, waiting for auth session...`);
  try {
    await page.waitForFunction(() => {
      try {
        const auth = (window as any).__test_auth;
        return !!auth?.currentUser;
      } catch (err) {
        return false;
      }
    }, { timeout: 45000 });
  } catch (err) {
    const authState = await page.evaluate(() => {
      const auth = (window as any).__test_auth;
      return { exists: !!auth, hasUser: !!auth?.currentUser, uid: auth?.currentUser?.uid };
    });
    console.error(`[E2E] Auth session not found after 45s. State:`, authState);
    throw err;
  }

  await expect(page.getByTestId('header-login-button')).toHaveCount(0, { timeout: 30000 });
  console.log(`[E2E] Sign-in verified for ${email}`);
}

export async function stabilizeAuthenticatedSession(page: Page, email: string, password = 'testpass') {
  const loginVisible = await page.getByRole('button', { name: /Log In|Iniciar sesion|Iniciar sesión/i }).count();
  if (loginVisible > 0) {
    await signInInBrowser(page, email, password);
  }
  await expect(page.getByTestId('header-login-button')).toHaveCount(0, { timeout: 30000 });
}

export async function e2eCleanupTrip(_page: Page, _tripId: string) {
  // No-op by design: emulator session is ephemeral for CI and local e2e runs.
}
