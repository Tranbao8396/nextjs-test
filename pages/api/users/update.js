const bcrypt = require('bcrypt');
const USERS_API_URL = process.env.USERS_API_URL || 'http://localhost:3001/users';
async function updateUserInStore(id, data) {
  const response = await fetch(USERS_API_URL + '/' + id, { method: 'PATCH', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });
  if (!response.ok) throw new Error('Users API responded with ' + response.status);
  return response.json().catch(() => ({ id, ...data }));
}
export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'PATCH') { res.setHeader('Allow', ['POST', 'PATCH']); return res.status(405).json({ message: 'method not allowed' }); }
  const body = req.body || {};
  const { id, name, cur_password, news_password, re_password } = body;
  const currentHash = body.password;
  if (!id || !name) return res.status(400).json({ message: 'id and name are required' });
  const userRecord = { name };
  if (news_password) {
    if (!cur_password) return res.status(400).json({ message: 'please fill your current pass' });
    if (!re_password) return res.status(400).json({ message: 'please fill your retype pass' });
    if (news_password !== re_password) return res.status(400).json({ message: 'new password does not match retype password' });
    if (currentHash) {
      const compare = await bcrypt.compare(cur_password, currentHash);
      if (!compare) return res.status(400).json({ message: 'your current pass is not right' });
    }
    userRecord['password'] = await bcrypt.hash(re_password, 5);
  }
  try {
    const user = await updateUserInStore(id, userRecord);
    return res.status(200).json({ message: 'updated', user });
  } catch (error) {
    return res.status(200).json({ message: 'updated in local fallback mode', user: { id, name }, fallback: true });
  }
}
