const bcrypt = require("bcrypt");

export default async function handler(req, res) {
  const body = req.body;
  const password = body.password;
  const pass_crypt = await bcrypt.hash(password, 5)
  const data = {
    name: body.name,
    password: pass_crypt
  }

  const create = await fetch('http://localhost:3001/users', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  })

  if (create) {
    return res.status(200).json({ message: "created" });
  } else {
    return res.status(400).json({ message: "oops" });
  }
}
