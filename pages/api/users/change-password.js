import { getToken } from 'next-auth/jwt';
import { changeMockUserPassword } from '../../../data/users';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'method not allowed' });
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.sub) {
    return res.status(401).json({ message: 'authentication required' });
  }

  const result = await changeMockUserPassword({
    id: token.sub,
    currentPassword: req.body?.currentPassword,
    newPassword: req.body?.newPassword,
    confirmPassword: req.body?.confirmPassword,
  });

  return res.status(result.status).json({ message: result.message });
}
