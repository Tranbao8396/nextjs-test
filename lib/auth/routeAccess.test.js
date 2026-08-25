import { decideRouteAccess } from './routeAccess';

test.each([
  [{ pathname: '/dashboard', token: null, user: null }, 'login'],
  [{ pathname: '/dashboard', token: { sub: 'missing' }, user: null }, 'login'],
  [{ pathname: '/dashboard/users', token: { sub: '1' }, user: { roles: 'user' } }, 'home'],
  [{ pathname: '/dashboard', token: { sub: '1' }, user: { roles: 'admin' } }, 'allow'],
  [{ pathname: '/login', token: { sub: '1' }, user: { roles: 'admin' } }, 'home'],
  [{ pathname: '/posts', token: null, user: null }, 'allow'],
])('returns a deterministic route decision', (input, expected) => {
  expect(decideRouteAccess(input).action).toBe(expected);
});
