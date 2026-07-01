import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { findUserById, sanitizeUser, updateMockUserProfile } from "../../../data/mockUsers";

function sessionUser(session) {
  if (!session?.user) return null;

  const mockUser = findUserById(session.user.id);
  return mockUser
    ? sanitizeUser(mockUser)
    : {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        roles: session.user.roles || "user",
        provider: session.user.provider || "google",
      };
}

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "GET") {
    return res.status(200).json({ user: sessionUser(session) });
  }

  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const result = await updateMockUserProfile({
    id: session.user.id,
    name: req.body?.name,
    currentPassword: req.body?.currentPassword,
    newPassword: req.body?.newPassword,
    fallbackUser: session.user,
  });

  if (!result.ok) {
    return res.status(result.status).json({ message: result.message });
  }

  return res.status(result.status).json({
    message: "updated",
    user: result.user,
    readOnlyPassword: result.readOnlyPassword || false,
  });
}
