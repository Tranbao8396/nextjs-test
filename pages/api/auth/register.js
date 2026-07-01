import { createMockUser } from "../../../data/mockUsers";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const result = await createMockUser(req.body || {});

  if (!result.ok) {
    return res.status(result.status).json({ message: result.message });
  }

  return res.status(result.status).json({ message: "created", user: result.user });
}
