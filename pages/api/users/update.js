const bcrypt = require("bcrypt");

export default async function handler(req, res) {
  const body = req.body;
  const id = body.id;
  const password = body.password;
  const cur_password = body.cur_password;
  const news_password = body.news_password;
  const re_password = body.re_password;
  let data = {
    name: body.name,
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
        password: pass_crypt
      }
    } else {
      return res.status(400).json({message: 'news pass is not fixed'});
    }
  }

  const update = await fetch(`http://localhost:3001/users/${id}`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  })

  if (update) {
    return res.status(200).json({message: 'updated'});
  } else {
    return res.status(400).json({message: 'something wrong'});
  }
}
