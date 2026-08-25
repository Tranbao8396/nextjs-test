import { backendRequest } from '../lib/server/backendClient';
import createHandler from '../pages/api/posts/create';
import deleteHandler from '../pages/api/posts/delete/[id]';
import updateHandler from '../pages/api/posts/update';

jest.mock('../lib/server/backendClient', () => {
  const actual = jest.requireActual('../lib/server/backendClient');
  return { ...actual, backendRequest: jest.fn() };
});

function responseMock() {
  return { setHeader: jest.fn(), status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
}

test.each([
  ['create', createHandler],
  ['update', updateHandler],
  ['delete', deleteHandler],
])('%s route enforces its method guard', async (_name, handler) => {
  const res = responseMock();
  await handler({ method: 'PATCH', body: {}, query: {} }, res);
  expect(res.status).toHaveBeenCalledWith(405);
  expect(backendRequest).not.toHaveBeenCalled();
});

test('create route maps only the Courses create contract', async () => {
  backendRequest.mockResolvedValue({ id: 1 });
  const res = responseMock();
  await createHandler({ method: 'POST', body: { title: 'T', author: 'A', url: '/t', slug: 't', content: 'C', ignored: true } }, res);
  expect(backendRequest).toHaveBeenCalledWith('/courses', {
    method: 'POST',
    body: { title: 'T', author: 'A', url: '/t', slug: 't', content: 'C' },
  });
});

test('update and delete routes use numeric resource paths', async () => {
  backendRequest.mockResolvedValue({ id: 7 });
  await updateHandler({ method: 'POST', body: { id: 7, title: 'T', content: 'C', ignored: true } }, responseMock());
  expect(backendRequest).toHaveBeenLastCalledWith('/courses/7', {
    method: 'POST',
    body: { title: 'T', content: 'C' },
  });
  await deleteHandler({ method: 'DELETE', query: { id: '7' } }, responseMock());
  expect(backendRequest).toHaveBeenLastCalledWith('/courses/7', { method: 'DELETE', body: undefined });
});
