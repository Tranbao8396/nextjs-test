export default async function handler(req, res) {
  const body = req.body;
  const email = body.email;
  const password = body.password;
  const users = await fetch('http://localhost:3000/api/users').then((res)=>res.json());
  let valid;
  users.map((user) => {
    if (email === user.email && password === user.password) {
      valid = true;
    }
    valid = false;
  });

  // return res.end();
}