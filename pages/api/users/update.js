import { updateMockUserProfile } from "../../../data/mockUsers";

export default async function handler(req, res) {
  if (req.method !== "POST" && req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const body = req.body || {};
  const result = await updateMockUserProfile({
    id: body.id,
    name: body.name,
    currentPassword: body.cur_password || body.currentPassword,
    newPassword: body.news_password || body.newPassword,
  });

  if (!result.ok) {
    return res.status(result.status).json({ message: result.message });
  }

  return res.status(200).json({ message: "updated", user: result.user });
}
