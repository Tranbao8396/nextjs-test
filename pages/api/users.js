export default function handler(req, res) {
  if (req.method === 'GET') {
    res.json([
      {
        id: '01',
        email: 'a@a.com',
        password: '1111',
      },
      {
        id: '02',
        email: 'b@b.com',
        password: '1234',
      },
    ]);
  }
}