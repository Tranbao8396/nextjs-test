import { backendRequest } from './backendClient';
import { handleCourseMutation } from './courseApi';

jest.mock('./backendClient', () => {
  const actual = jest.requireActual('./backendClient');
  return { ...actual, backendRequest: jest.fn() };
});

function responseMock() {
  return { setHeader: jest.fn(), status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
}

const config = {
  method: 'POST',
  path: ({ body }) => `/courses/${body.id}`,
  successMessage: 'updated',
  mapPayload: ({ body }) => ({ title: body.title }),
};

test('returns 405 without contacting the backend', async () => {
  const res = responseMock();
  await handleCourseMutation({ method: 'GET', body: {} }, res, config);
  expect(res.setHeader).toHaveBeenCalledWith('Allow', 'POST');
  expect(res.status).toHaveBeenCalledWith(405);
  expect(backendRequest).not.toHaveBeenCalled();
});

test('maps the approved payload and returns success', async () => {
  backendRequest.mockResolvedValue({ id: 2 });
  const res = responseMock();
  await handleCourseMutation({ method: 'POST', body: { id: 2, title: 'Course', ignored: true } }, res, config);
  expect(backendRequest).toHaveBeenCalledWith('/courses/2', { method: 'POST', body: { title: 'Course' } });
  expect(res.status).toHaveBeenCalledWith(200);
});
