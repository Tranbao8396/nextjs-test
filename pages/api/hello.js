export default function handler(req, res) {
  if (req.method === 'GET') {
    res.json([
      {
        id: '01',
        title: 'Test Post',
        slug: 'test-post',
        content: 'This is test post'
      },
      {
        id: '02',
        title: 'Test Post 2',
        slug: 'test-post-2',
        content: 'This is test post 2'
      },
      {
        id: '03',
        title: 'Test Post 3',
        slug: 'test-post-3',
        content: 'This is test post 3'
      }
    ]);
  }
}