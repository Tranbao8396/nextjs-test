export default async function handler(req, res) {
  const body = req.body;
  const id = body.id;

  console.log(body);

  const update = await fetch(`http://localhost:3001/courses/${id}`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" }
  })

  if (update) {
    return res.status(200).json();
  } else {
    return res.status(400).json();
  }
}
