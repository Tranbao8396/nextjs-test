import { getToken } from 'next-auth/jwt';
import { changeMockUserPassword } from '../../../data/users.js';

export function createChangePasswordHandler({
  readToken = getToken,
  changePassword = changeMockUserPassword,
} = {}) {
  return async function handler(req, res) {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ code: 'METHOD_NOT_ALLOWED', message: 'method not allowed' });
    }

    let token;
    try {
      token = await readToken({ req, secret: process.env.NEXTAUTH_SECRET });
    } catch {
      return res.status(401).json({ code: 'UNAUTHENTICATED', message: 'authentication required' });
    }
    if (!token?.sub) {
      return res.status(401).json({ code: 'UNAUTHENTICATED', message: 'authentication required' });
    }

    const result = await changePassword({
      userId: token.sub,
      currentPassword: req.body?.currentPassword,
      newPassword: req.body?.newPassword,
      confirmPassword: req.body?.confirmPassword,
    });
    return res.status(result.status).json({ code: result.code, message: result.message });
  };
}

export default createChangePasswordHandler();
