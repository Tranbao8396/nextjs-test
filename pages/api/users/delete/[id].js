import { deleteMockUser } from '../../../../data/users';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'method not allowed' });
  }

  const { id } = req.query;
  const result = await deleteMockUser(id);
  return res.status(result.status).json({ message: result.message });
}
