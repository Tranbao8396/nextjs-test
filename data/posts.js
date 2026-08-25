import { backendRequest } from '../lib/server/backendClient';

export async function getSortedPostsData() {
  return backendRequest('/courses');
}

export async function getPostData(slug) {
  return backendRequest(`/courses/${encodeURIComponent(slug)}`);
}
