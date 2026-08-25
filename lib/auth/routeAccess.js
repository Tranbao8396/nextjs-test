export function decideRouteAccess({ pathname, token, user }) {
  const isDashboard = pathname === '/dashboard' || pathname.startsWith('/dashboard/');
  const isLogin = pathname === '/login';

  if (isDashboard && (!token || !user)) {
    return { action: 'login', callbackUrl: pathname };
  }
  if (isDashboard && user?.roles === 'user') {
    return { action: 'home' };
  }
  if (isLogin && token) {
    return { action: 'home' };
  }
  return { action: 'allow' };
}
