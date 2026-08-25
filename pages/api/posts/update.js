import { handleCourseMutation } from '../../../lib/server/courseApi';

export default function handler(req, res) {
  return handleCourseMutation(req, res, {
    method: 'POST',
    path: ({ body = {} }) => `/courses/${body.id}`,
    successMessage: 'updated',
    mapPayload: ({ body = {} }) => ({
      title: body.title,
      content: body.content,
    }),
  });
}
