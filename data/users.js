const USERS_API_URL = process.env.USERS_API_URL || process.env.NEXT_PUBLIC_USERS_API_URL || 'http://localhost:3001/users';

const fallbackUsers = [
  { id: '1', name: 'Admin' },
  { id: '2', name: 'Demo User' },
];

async function requestUsers(path = '', options = {}) {
  try {
    const res = await fetch(USERS_API_URL + path, options);
    if (!res.ok) throw new Error('Users API responded with ' + res.status);
    return res.json();
  } catch (error) {
    return null;
  }
}

export async function getAllUsersData() {
  const users = await requestUsers();
  return Array.isArray(users) ? users : fallbackUsers;
}

export async function getAllUserId() {
  const users = await getAllUsersData();
  return users.map((user) => ({ params: { id: String(user.id) } }));
}

export async function getUserData(id) {
  const user = await requestUsers('/' + id);
  if (user) return user;
  return fallbackUsers.find((item) => String(item.id) === String(id)) || fallbackUsers[0];
}
