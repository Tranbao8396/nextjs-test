export default function handler(req, res) {
  const body = req.body;

  if (!body.email || !body.name) {
    // Sends a HTTP bad request error code
    return res.status(400).json({ data: 'First or last name not found' });
  }

  res.json({
    name: body.name,
    email: body.email
  });
}