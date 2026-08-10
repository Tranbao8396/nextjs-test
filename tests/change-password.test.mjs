import assert from 'node:assert/strict';
import test from 'node:test';
import { createChangePasswordHandler } from '../pages/api/users/change-password.js';
import {
  changeMockUserPassword,
  checkUserCredentials,
  createMockUser,
} from '../data/users.js';

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
    setHeader(name, value) {
      this.headers[name] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

test('changes the authenticated mock user password', async () => {
  const fixture = await createFixtureUser('password-success');
  const result = await changeMockUserPassword({
    userId: fixture.id,
    currentPassword: fixture.password,
    newPassword: 'test-new-password',
    confirmPassword: 'test-new-password',
  });

  assert.deepEqual(result, {
    ok: true,
    status: 200,
    code: 'PASSWORD_CHANGED',
    message: 'password changed successfully',
  });
  assert.equal(await checkUserCredentials({ name: fixture.name, password: fixture.password }), null);
  assert.equal((await checkUserCredentials({ name: fixture.name, password: 'test-new-password' }))?.id, fixture.id);
});

test('rejects an invalid current password without mutating credentials', async () => {
  const fixture = await createFixtureUser('password-invalid-current');
  const result = await changeMockUserPassword({
    userId: fixture.id,
    currentPassword: 'test-wrong-password',
    newPassword: 'test-new-password',
    confirmPassword: 'test-new-password',
  });

  assert.equal(result.code, 'INVALID_CURRENT_PASSWORD');
  assert.equal((await checkUserCredentials({ name: fixture.name, password: fixture.password }))?.id, fixture.id);
  assert.equal(await checkUserCredentials({ name: fixture.name, password: 'test-new-password' }), null);
});

test('rejects mismatched confirmation without mutating credentials', async () => {
  const fixture = await createFixtureUser('password-mismatch');
  const result = await changeMockUserPassword({
    userId: fixture.id,
    currentPassword: fixture.password,
    newPassword: 'test-new-password',
    confirmPassword: 'test-different-password',
  });

  assert.equal(result.code, 'PASSWORD_MISMATCH');
  assert.equal((await checkUserCredentials({ name: fixture.name, password: fixture.password }))?.id, fixture.id);
});

test('validates required fields and password strength', async (t) => {
  const fixture = await createFixtureUser('password-validation');
  const cases = [
    [{ userId: fixture.id }, 'CURRENT_PASSWORD_REQUIRED'],
    [{ userId: fixture.id, currentPassword: fixture.password }, 'NEW_PASSWORD_REQUIRED'],
    [{ userId: fixture.id, currentPassword: fixture.password, newPassword: 'test-new-password' }, 'CONFIRM_PASSWORD_REQUIRED'],
    [{ userId: fixture.id, currentPassword: fixture.password, newPassword: 'short', confirmPassword: 'short' }, 'WEAK_PASSWORD'],
    [{ userId: fixture.id, currentPassword: fixture.password, newPassword: fixture.password, confirmPassword: fixture.password }, 'PASSWORD_UNCHANGED'],
  ];

  for (const [input, expectedCode] of cases) {
    await t.test(expectedCode, async () => {
      const result = await changeMockUserPassword(input);
      assert.equal(result.ok, false);
      assert.equal(result.code, expectedCode);
    });
  }
});

test('returns a stable error for an unknown user', async () => {
  const result = await changeMockUserPassword({
    userId: 'missing-user',
    currentPassword: 'test-current-password',
    newPassword: 'test-new-password',
    confirmPassword: 'test-new-password',
  });

  assert.equal(result.status, 404);
  assert.equal(result.code, 'USER_NOT_FOUND');
});

test('API rejects unsupported methods without reading the session', async () => {
  let tokenRead = false;
  const handler = createChangePasswordHandler({
    readToken: async () => {
      tokenRead = true;
      return null;
    },
  });
  const response = createResponse();

  await handler({ method: 'GET' }, response);

  assert.equal(response.statusCode, 405);
  assert.deepEqual(response.headers.Allow, ['POST']);
  assert.equal(response.body.code, 'METHOD_NOT_ALLOWED');
  assert.equal(tokenRead, false);
});

test('API rejects missing and invalid sessions', async (t) => {
  for (const [name, readToken] of [
    ['missing token', async () => null],
    ['token read failure', async () => { throw new Error('test-token-error'); }],
  ]) {
    await t.test(name, async () => {
      const handler = createChangePasswordHandler({ readToken });
      const response = createResponse();
      await handler({ method: 'POST', body: {} }, response);
      assert.equal(response.statusCode, 401);
      assert.equal(response.body.code, 'UNAUTHENTICATED');
    });
  }
});

test('API binds password changes to the session subject', async () => {
  let receivedInput;
  const handler = createChangePasswordHandler({
    readToken: async () => ({ sub: 'session-user' }),
    changePassword: async (input) => {
      receivedInput = input;
      return { status: 200, code: 'PASSWORD_CHANGED', message: 'password changed successfully' };
    },
  });
  const response = createResponse();

  await handler({
    method: 'POST',
    body: {
      userId: 'tampered-user',
      currentPassword: 'test-current-password',
      newPassword: 'test-new-password',
      confirmPassword: 'test-new-password',
    },
  }, response);

  assert.equal(response.statusCode, 200);
  assert.equal(receivedInput.userId, 'session-user');
  assert.equal('userId' in response.body, false);
});

test('API preserves stable domain error contracts', async () => {
  const handler = createChangePasswordHandler({
    readToken: async () => ({ sub: 'session-user' }),
    changePassword: async () => ({ status: 400, code: 'PASSWORD_MISMATCH', message: 'new password and confirmation do not match' }),
  });
  const response = createResponse();

  await handler({ method: 'POST', body: {} }, response);

  assert.equal(response.statusCode, 400);
  assert.deepEqual(response.body, { code: 'PASSWORD_MISMATCH', message: 'new password and confirmation do not match' });
});
