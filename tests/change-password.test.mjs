import assert from 'node:assert/strict';
import test from 'node:test';
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
