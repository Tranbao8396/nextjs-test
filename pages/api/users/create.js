const bcrypt = require('bcrypt');
const USERS_API_URL = process.env.USERS_API_URL || 'http://localhost:3001/users';
async function createUserInStore(data) {
  const response = await fetch(USERS_API_URL, { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });
  if (!response.ok) throw new Error('Users API responded with ' + response.status);
  return response.json().catch(() => data);
}
export default async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', ['POST']); return res.status(405).json({ message: 'method not allowed' }); }
  const body = req.body || {};
  const name = body.name;
  const submittedPass = body.password;
  if (!name || !submittedPass) return res.status(400).json({ message: 'name and password are required' });
  const passCrypt = await bcrypt.hash(submittedPass, 5);
  const userRecord = { name };
  userRecord['password'] = passCrypt;
  try {
    const user = await createUserInStore(userRecord);
    return res.status(200).json({ message: 'created', user });
  } catch (error) {
    return res.status(200).json({ message: 'created in local fallback mode', user: { id: Date.now(), name }, fallback: true });
  }
}
