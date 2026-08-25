const consumer = require('./courses.schema.json');

test('keeps the required provider fields, primitive types and REST paths', () => {
  expect(consumer.required).toEqual(['id', 'title', 'slug', 'content', 'author', 'url']);
  expect(Object.fromEntries(Object.entries(consumer.properties).map(([key, value]) => [key, value.type]))).toEqual({ id: 'integer', title: 'string', slug: 'string', content: 'string', author: 'string', url: 'string' });
  expect(consumer['x-rest-paths']).toEqual({
    collection: '/courses',
    detail: '/courses/{slug}',
    mutation: '/courses/{id}',
  });
});
