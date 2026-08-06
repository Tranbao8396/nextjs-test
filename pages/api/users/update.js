import { updateMockUser } from '../../../data/users';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'method not allowed' });
  }

  const result = await updateMockUser(req.body || {});
  return res.status(result.status).json({ message: result.message, user: result.user });
}
