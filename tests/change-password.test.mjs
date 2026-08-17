import assert from 'node:assert/strict';
import test from 'node:test';
import { changeMockUserPassword, checkUserCredentials } from '../data/users.js';

test('rejects an incorrect current password without changing credentials', async () => {
  const result = await changeMockUserPassword({ id: '1', currentPassword: 'wrong-password', newPassword: 'new-password-42', confirmPassword: 'new-password-42' });
  assert.equal(result.ok, false);
  assert.equal(result.status, 400);
  assert.match(result.message, /current password/i);
  assert.equal((await checkUserCredentials({ name: 'demo', password: 'demo' }))?.id, '1');
});

test('rejects mismatched password confirmation', async () => {
  const result = await changeMockUserPassword({ id: '1', currentPassword: 'demo', newPassword: 'new-password-42', confirmPassword: 'different-password' });
  assert.equal(result.ok, false);
  assert.match(result.message, /confirmation/i);
});

test('rejects a weak new password', async () => {
  const result = await changeMockUserPassword({ id: '1', currentPassword: 'demo', newPassword: 'short', confirmPassword: 'short' });
  assert.equal(result.ok, false);
  assert.match(result.message, /at least 8/i);
});

test('rejects an unknown user', async () => {
  const result = await changeMockUserPassword({ id: 'missing', currentPassword: 'demo', newPassword: 'new-password-42', confirmPassword: 'new-password-42' });
  assert.equal(result.ok, false);
  assert.equal(result.status, 404);
});

test('changes credentials only after all checks pass', async () => {
  const result = await changeMockUserPassword({ id: '1', currentPassword: 'demo', newPassword: 'new-password-42', confirmPassword: 'new-password-42' });
  assert.equal(result.ok, true);
  assert.equal(await checkUserCredentials({ name: 'demo', password: 'demo' }), null);
  assert.equal((await checkUserCredentials({ name: 'demo', password: 'new-password-42' }))?.id, '1');
});
