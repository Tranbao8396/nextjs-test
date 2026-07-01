import bcrypt from "bcrypt";

const initialUsers = [
  {
    id: "1",
    name: "demo",
    email: "demo@example.com",
    password: "password",
    roles: "user",
    provider: "credentials",
  },
];

function getStore() {
  if (!globalThis.__nextjsTestMockUsers) {
    globalThis.__nextjsTestMockUsers = [...initialUsers];
  }

  return globalThis.__nextjsTestMockUsers;
}

async function passwordMatches(inputPassword, storedPassword) {
  if (!storedPassword) return false;

  if (String(storedPassword).startsWith("$2")) {
    return bcrypt.compare(inputPassword || "", storedPassword);
  }

  return String(inputPassword || "") === String(storedPassword);
}

export function sanitizeUser(user) {
  if (!user) return null;

  const { password, ...safeUser } = user;
  return safeUser;
}

export function findUserById(id) {
  return getStore().find((user) => String(user.id) === String(id)) || null;
}

export function findUserByName(name) {
  return getStore().find((user) => user.name.toLowerCase() === String(name || "").toLowerCase()) || null;
}

export async function verifyUserCredentials(name, password) {
  const user = findUserByName(name || "");

  if (!user || user.provider !== "credentials") {
    return null;
  }

  const isValid = await passwordMatches(password, user.password);
  return isValid ? sanitizeUser(user) : null;
}

export async function createMockUser({ name, password, email }) {
  const users = getStore();
  const normalizedName = String(name || "").trim();

  if (!normalizedName || !password) {
    return { ok: false, status: 400, message: "Name and password are required." };
  }

  if (String(password).length < 6) {
    return { ok: false, status: 400, message: "Password must be at least 6 characters." };
  }

  if (findUserByName(normalizedName)) {
    return { ok: false, status: 409, message: "This name is already registered." };
  }

  const user = {
    id: String(Date.now()),
    name: normalizedName,
    email: email || `${normalizedName}@example.com`,
    password: await bcrypt.hash(password, 5),
    roles: "user",
    provider: "credentials",
  };

  users.push(user);
  return { ok: true, status: 201, user: sanitizeUser(user) };
}

export async function updateMockUserProfile({ id, name, currentPassword, newPassword, fallbackUser }) {
  const user = findUserById(id);

  if (!user) {
    const externalUser = {
      id,
      name: name || fallbackUser?.name || "OAuth User",
      email: fallbackUser?.email || "",
      roles: fallbackUser?.roles || "user",
      provider: fallbackUser?.provider || "google",
    };

    return { ok: true, status: 200, user: externalUser, readOnlyPassword: true };
  }

  if (user.provider !== "credentials") {
    if (name) user.name = String(name).trim();
    return { ok: true, status: 200, user: sanitizeUser(user), readOnlyPassword: true };
  }

  if (newPassword) {
    if (!currentPassword) {
      return { ok: false, status: 400, message: "Current password is required." };
    }

    const isCurrentPasswordValid = await passwordMatches(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return { ok: false, status: 400, message: "Current password is not correct." };
    }

    if (String(newPassword).length < 6) {
      return { ok: false, status: 400, message: "New password must be at least 6 characters." };
    }

    user.password = await bcrypt.hash(newPassword, 5);
  }

  if (name) {
    user.name = String(name).trim();
  }

  return { ok: true, status: 200, user: sanitizeUser(user) };
}
