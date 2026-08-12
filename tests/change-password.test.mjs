import assert from 'node:assert/strict';
import test from 'node:test';
import { createChangePasswordHandler } from '../pages/api/users/change-password.js';
import { changeMockUserPassword, checkUserCredentials, createMockUser } from '../data/users.js';

async function createFixtureUser(name) {
  const password = 'test-current-password';
  const result = await createMockUser({ name, password });
  assert.equal(result.ok, true);
  return { id: result.user.id, name, password };
}

function createResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: undefined,
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

test('changes the authenticated mock user password', async () => {
  const fixture = await createFixtureUser('test-password-success');
  const result = await changeMockUserPassword({ userId: fixture.id, currentPassword: fixture.password, newPassword: 'test-new-password', confirmPassword: 'test-new-password' });
  assert.deepEqual(result, { ok: true, status: 200, code: 'PASSWORD_CHANGED', message: 'password changed successfully' });
  assert.equal(await checkUserCredentials({ name: fixture.name, password: fixture.password }), null);
  assert.equal((await checkUserCredentials({ name: fixture.name, password: 'test-new-password' }))?.id, fixture.id);
});

test('rejects invalid current password and preserves credentials', async () => {
  const fixture = await createFixtureUser('test-password-invalid-current');
  const result = await changeMockUserPassword({ userId: fixture.id, currentPassword: 'test-wrong-password', newPassword: 'test-new-password', confirmPassword: 'test-new-password' });
  assert.equal(result.code, 'INVALID_CURRENT_PASSWORD');
  assert.equal((await checkUserCredentials({ name: fixture.name, password: fixture.password }))?.id, fixture.id);
  assert.equal(await checkUserCredentials({ name: fixture.name, password: 'test-new-password' }), null);
});

test('rejects invalid password contracts without mutation', async (t) => {
  const fixture = await createFixtureUser('test-password-validation');
  const cases = [
    [{ userId: fixture.id }, 'CURRENT_PASSWORD_REQUIRED'],
    [{ userId: fixture.id, currentPassword: fixture.password }, 'NEW_PASSWORD_REQUIRED'],
    [{ userId: fixture.id, currentPassword: fixture.password, newPassword: 'test-new-password' }, 'CONFIRM_PASSWORD_REQUIRED'],
    [{ userId: fixture.id, currentPassword: fixture.password, newPassword: 'short', confirmPassword: 'short' }, 'WEAK_PASSWORD'],
    [{ userId: fixture.id, currentPassword: fixture.password, newPassword: 'test-new-password', confirmPassword: 'test-different-password' }, 'PASSWORD_MISMATCH'],
    [{ userId: fixture.id, currentPassword: fixture.password, newPassword: fixture.password, confirmPassword: fixture.password }, 'PASSWORD_UNCHANGED'],
  ];
  for (const [input, expectedCode] of cases) {
    await t.test(expectedCode, async () => assert.equal((await changeMockUserPassword(input)).code, expectedCode));
  }
  assert.equal((await checkUserCredentials({ name: fixture.name, password: fixture.password }))?.id, fixture.id);
});

test('returns a stable error for an unknown user', async () => {
  const result = await changeMockUserPassword({ userId: 'test-missing-user', currentPassword: 'test-current-password', newPassword: 'test-new-password', confirmPassword: 'test-new-password' });
  assert.equal(result.status, 404);
  assert.equal(result.code, 'USER_NOT_FOUND');
});

test('API rejects unsupported methods before reading the session', async () => {
  let tokenRead = false;
  const handler = createChangePasswordHandler({ readToken: async () => { tokenRead = true; return null; } });
  const response = createResponse();
  await handler({ method: 'GET' }, response);
  assert.equal(response.statusCode, 405);
  assert.deepEqual(response.headers.Allow, ['POST']);
  assert.equal(response.body.code, 'METHOD_NOT_ALLOWED');
  assert.equal(tokenRead, false);
});

test('API rejects missing and failed sessions', async (t) => {
  const readers = [async () => null, async () => { throw new Error('test-token-error'); }];
  for (const readToken of readers) {
    await t.test('unauthenticated request', async () => {
      const response = createResponse();
      await createChangePasswordHandler({ readToken })({ method: 'POST', body: {} }, response);
      assert.equal(response.statusCode, 401);
      assert.equal(response.body.code, 'UNAUTHENTICATED');
    });
  }
});

test('API binds mutation to session subject and ignores a tampered userId', async () => {
  let receivedInput;
  const handler = createChangePasswordHandler({
    readToken: async () => ({ sub: 'test-session-user' }),
    changePassword: async (input) => { receivedInput = input; return { status: 200, code: 'PASSWORD_CHANGED', message: 'password changed successfully' }; },
  });
  const response = createResponse();
  await handler({ method: 'POST', body: { userId: 'test-tampered-user', currentPassword: 'test-current-password', newPassword: 'test-new-password', confirmPassword: 'test-new-password' } }, response);
  assert.equal(response.statusCode, 200);
  assert.equal(receivedInput.userId, 'test-session-user');
  assert.equal('userId' in response.body, false);
});
