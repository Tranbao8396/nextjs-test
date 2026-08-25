import { BackendClientError, backendRequest } from './backendClient';

export async function handleCourseMutation(req, res, config) {
  if (req.method !== config.method) {
    res.setHeader('Allow', config.method);
    return res.status(405).json({ message: 'method not allowed' });
  }

  try {
    const payload = config.mapPayload ? config.mapPayload(req) : undefined;
    const data = await backendRequest(config.path(req), {
      method: config.method,
      body: payload,
    });
    return res.status(200).json({ message: config.successMessage, data });
  } catch (error) {
    const status = error instanceof BackendClientError ? error.status : 500;
    const message =
      error instanceof BackendClientError ? error.message : 'internal server error';
    return res.status(status).json({ message });
  }
}
