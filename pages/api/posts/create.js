import { handleCourseMutation } from '../../../lib/server/courseApi';

export default function handler(req, res) {
  return handleCourseMutation(req, res, {
    method: 'POST',
    path: () => '/courses',
    successMessage: 'created',
    mapPayload: ({ body = {} }) => ({
      title: body.title,
      author: body.author,
      url: body.url,
      slug: body.slug,
      content: body.content,
    }),
  });
}
