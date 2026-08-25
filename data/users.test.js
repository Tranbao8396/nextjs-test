import { checkUserCredentials, createMockUser, deleteMockUser, getAllUsersData, updateMockUser } from './users';

beforeEach(() => { delete globalThis.__NEXTJS_TEST_MOCK_USERS__; });

test('creates, authenticates, updates and deletes a mock user', async () => {
  const created = await createMockUser({ name: 'alice', password: 'secret' });
  expect(created).toMatchObject({ ok: true, user: { name: 'alice', roles: 'admin' } });
  expect(created.user).not.toHaveProperty('loginDigest');
  await expect(checkUserCredentials({ name: 'alice', password: 'secret' })).resolves.toMatchObject({ name: 'alice' });
  const updated = await updateMockUser({ id: created.user.id, name: 'alice-updated', cur_password: 'secret', news_password: 'new-secret', re_password: 'new-secret' });
  expect(updated).toMatchObject({ ok: true, user: { name: 'alice-updated' } });
  await expect(checkUserCredentials({ name: 'alice-updated', password: 'new-secret' })).resolves.toBeTruthy();
  await expect(deleteMockUser(created.user.id)).resolves.toMatchObject({ ok: true });
  await expect(getAllUsersData()).resolves.toHaveLength(1);
});

test('rejects invalid mock user writes deterministically', async () => {
  await expect(updateMockUser({ id: 'missing', name: 'x' })).resolves.toMatchObject({ status: 404 });
  await expect(createMockUser({ name: '', password: '' })).resolves.toMatchObject({ status: 400 });
});
