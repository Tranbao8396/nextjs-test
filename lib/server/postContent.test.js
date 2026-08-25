import { sanitizePostContent } from './postContent';

test('removes executable HTML while preserving safe content', () => {
  const result = sanitizePostContent('<p>Hello</p><script>alert(1)</script><img src="javascript:bad" onerror="bad()">');
  expect(result).toContain('<p>Hello</p>');
  expect(result).not.toMatch(/script|onerror|javascript:/i);
});
