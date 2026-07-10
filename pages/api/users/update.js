const bcrypt = require("bcrypt");

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const body = req.body;
  const id = body.id;
  const password = body.password;
  const cur_password = body.cur_password;
  const news_password = body.news_password;
  const re_password = body.re_password;

  if (!id || !body.name || !body.roles) {
    return res.status(400).json({message: 'name and role are required'});
  }

  let data = {
    name: body.name,
    roles: body.roles,
  }

  if (cur_password !== '') {
    let compare = await bcrypt.compare(cur_password, password);

    if (!compare) {
      return res.status(400).json({message: 'your current pass is not right'});
    }
  }

  if (news_password !== '') {
    if (cur_password === '') {
      return res.status(400).json({message: 'please fill your current pass'});
    }

    if (re_password === '') {
      return res.status(400).json({message: 'please fill your retype pass'});
    }

    if (news_password === re_password) {
      const pass_crypt = await bcrypt.hash(re_password, 5)
      data = {
        name: body.name,
        roles: body.roles,
        password: pass_crypt
      }
    } else {
      return res.status(400).json({message: 'news pass is not fixed'});
    }
  }

  const update = await fetch(`http://localhost:3001/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  })

  if (update.ok) {
    return res.status(200).json({message: 'updated'});
  } else {
    return res.status(400).json({message: 'something wrong'});
  }
}
