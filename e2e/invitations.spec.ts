import { test, expect } from '@playwright/test';

const FIREBASE_PROJECT = process.env.VITE_FIREBASE_PROJECT_ID || 'keeptrip-app-b06b3';
const AUTH_EMULATOR_URL = 'http://127.0.0.1:9099';
const FIRESTORE_EMULATOR_URL = 'http://127.0.0.1:8080';

async function createAuthUser(email: string, password = 'testpass') {
  const res = await fetch(`${AUTH_EMULATOR_URL}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken: true })
  });
  return res.json();
}

async function createFirestoreDocument(path: string, fields: any, documentId?: string) {
  const url = documentId
    ? `${FIRESTORE_EMULATOR_URL}/v1/projects/${FIREBASE_PROJECT}/databases/(default)/documents/${path}?documentId=${documentId}`
    : `${FIRESTORE_EMULATOR_URL}/v1/projects/${FIREBASE_PROJECT}/databases/(default)/documents/${path}`;
  const body = { fields };
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return res.json();
}

test.describe('Invitations flow (E2E)', () => {
  test('invitee accepts invitation and sees shared viaje', async ({ page }) => {
    const ownerEmail = 'owner@example.test';
    const inviteeEmail = 'invitee@example.test';
    const password = 'testpass';

    // create users in Auth emulator
    const owner = await createAuthUser(ownerEmail, password);
    const invitee = await createAuthUser(inviteeEmail, password);

    const ownerUid = owner.localId;
    const inviteeUid = invitee.localId;
    const viajeId = 'trip-e2e-1';
    const invitationId = `inv-${viajeId}-${inviteeUid}`;

    // create viaje document under owner
    await createFirestoreDocument(`usuarios/${ownerUid}/viajes`, {
      titulo: { stringValue: 'Viaje de prueba E2E' },
      nombreEspanol: { stringValue: 'Ciudad Test' },
      code: { stringValue: 'TT' },
      sharedWith: { arrayValue: {} },
      createdAt: { timestampValue: new Date().toISOString() }
    }, viajeId);

    // create viaje-level invitation (so rules allow sharedWith update)
    await fetch(`${FIRESTORE_EMULATOR_URL}/v1/projects/${FIREBASE_PROJECT}/databases/(default)/documents/usuarios/${ownerUid}/viajes/${viajeId}/invitations/${inviteeUid}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: {
        inviterId: { stringValue: ownerUid },
        inviteeUid: { stringValue: inviteeUid },
        viajeId: { stringValue: viajeId },
        status: { stringValue: 'pending' },
        createdAt: { timestampValue: new Date().toISOString() }
      }})
    });

    // create top-level invitation so the useInvitations hook will surface it
    await createFirestoreDocument('invitations', {
      inviterId: { stringValue: ownerUid },
      inviteeUid: { stringValue: inviteeUid },
      viajeId: { stringValue: viajeId },
      status: { stringValue: 'pending' },
      createdAt: { timestampValue: new Date().toISOString() }
    }, invitationId);

    // open app and sign in as invitee using the test helper exposed by AuthContext
    await page.goto('/');
    // sign in through the helper (VITE_ENABLE_TEST_LOGIN must be true in webServer.env)
    await page.evaluate(({ email, password }) => (window as any).__test_signInWithEmail({ email, password }), { email: inviteeEmail, password });

    // wait for the invitations badge to appear
    await page.waitForSelector('[data-testid="header-invitations-count"]');

    // open invitations view
    await page.click('[data-testid="header-invitations-button"]');

    // accept the invitation
    await page.waitForSelector(`[data-testid="inv-accept-${invitationId}"]`);
    await page.click(`[data-testid="inv-accept-${invitationId}"]`);

    // after accept, Visor should open with trip title
    await page.waitForSelector('h1');
    await expect(page.locator('h1')).toContainText('Viaje de prueba E2E');
  });
});
