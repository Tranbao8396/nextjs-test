export async function getAllUsersData() {
  const res = await fetch('http://localhost:3001/users');
  return res.json();
}

export async function getAllUserId() {
  const res = await fetch('http://localhost:3001/users');
  const users = await res.json();
  return users.map((user) => {
    return {
      params: {
        id: user.id,
      },
    };
  });
}

export async function getUserData(id) {
  const res = await fetch(`http://localhost:3001/users/${id}`);
  return res.json();
}
