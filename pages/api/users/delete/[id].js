export default async function handler(req, res) {
  const { id } = req.query;

  const erase = await fetch(`http://localhost:3001/users/${id}`, {
    method: 'DELETE',
  })

  if (erase) {
    return res.status(200).json({message: "erased"});
  } else {
    return res.status(400).json({message: "oops"});
  }
}
