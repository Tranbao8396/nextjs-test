

export default async function handler(req, res) {
  const body = req.body;

  const create = await fetch('http://localhost:3001/courses', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" }
  })

  if (create) {
    return res.status(200).json({message: "created"});
  } else {
    return res.status(400).json({message: "oops"});
  }
}
