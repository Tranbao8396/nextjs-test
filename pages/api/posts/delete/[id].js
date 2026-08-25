import { handleCourseMutation } from '../../../../lib/server/courseApi';

export default function handler(req, res) {
  return handleCourseMutation(req, res, {
    method: 'DELETE',
    path: ({ query }) => `/courses/${query.id}`,
    successMessage: 'erased',
  });
}
