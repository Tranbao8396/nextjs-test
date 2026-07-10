const bcrypt = require("bcrypt");

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const body = req.body;
  const password = body.password;

  if (!body.name || !password || !body.roles) {
    return res.status(400).json({ message: 'Name, password and role are required' });
  }

  const pass_crypt = await bcrypt.hash(password, 5)
  const data = {
    name: body.name,
    roles: body.roles,
    password: pass_crypt
  }

  const create = await fetch('http://localhost:3001/users', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  })

  if (create.ok) {
    return res.status(200).json({ message: "created" });
  } else {
    return res.status(400).json({ message: "oops" });
  }
}
