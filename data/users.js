const DEFAULT_USERS = [
  {
    id: '1',
    name: 'demo',
    roles: 'admin',
    loginDigest: 'mock-demo',
  },
];

function store() {
  if (!globalThis.__NEXTJS_TEST_MOCK_USERS__) {
    globalThis.__NEXTJS_TEST_MOCK_USERS__ = DEFAULT_USERS.map((user) => ({ ...user }));
  }
  return globalThis.__NEXTJS_TEST_MOCK_USERS__;
}

function sanitizeUser(user) {
  if (!user) return null;
  return {
    id: String(user.id),
    name: user.name,
    roles: user.roles || 'admin',
  };
}

function nextUserId(users) {
  const highest = users.reduce((max, user) => {
    const id = Number(user.id);
    return Number.isFinite(id) && id > max ? id : max;
  }, 0);
  return String(highest + 1);
}

function readLoginValue(input = {}) {
  return input.password || input.credential || '';
}

function makeMockLoginDigest(value) {
  return value ? 'mock-' + value : '';
}

export async function verifyUserLogin(value, storedDigest) {
  return Boolean(value && storedDigest && makeMockLoginDigest(value) === storedDigest);
}

export async function getAllUsersData() {
  return store().map(sanitizeUser);
}

export async function getAllUserId() {
  return store().map((user) => {
    return {
      params: {
        id: String(user.id),
      },
    };
  });
}

export async function getUserData(id) {
  return sanitizeUser(store().find((user) => String(user.id) === String(id)));
}

export async function createMockUser(input = {}) {
  const name = String(input.name || '').trim();
  const loginValue = readLoginValue(input);

  if (!name || !loginValue) {
    return { ok: false, status: 400, message: 'name and password are required' };
  }

  const users = store();
  const user = {
    id: nextUserId(users),
    name,
    roles: 'admin',
    loginDigest: makeMockLoginDigest(loginValue),
  };
  users.push(user);

  return { ok: true, status: 200, message: 'created', user: sanitizeUser(user) };
}

export async function updateMockUser(input = {}) {
  const users = store();
  const user = users.find((item) => String(item.id) === String(input.id));
  const name = String(input.name || '').trim();
  const currentLoginValue = input.cur_password || '';
  const newLoginValue = input.news_password || '';
  const repeatedLoginValue = input.re_password || '';

  if (!user) {
    return { ok: false, status: 404, message: 'user not found' };
  }

  if (!name) {
    return { ok: false, status: 400, message: 'name is required' };
  }

  user.name = name;

  if (newLoginValue !== '' || repeatedLoginValue !== '' || currentLoginValue !== '') {
    if (currentLoginValue === '') {
      return { ok: false, status: 400, message: 'please fill your current pass' };
    }

    const loginMatches = await verifyUserLogin(currentLoginValue, user.loginDigest);
    if (!loginMatches) {
      return { ok: false, status: 400, message: 'your current pass is not right' };
    }

    if (newLoginValue === '') {
      return { ok: false, status: 400, message: 'please fill your new pass' };
    }

    if (repeatedLoginValue === '') {
      return { ok: false, status: 400, message: 'please fill your retype pass' };
    }

    if (newLoginValue !== repeatedLoginValue) {
      return { ok: false, status: 400, message: 'news pass is not fixed' };
    }

    user.loginDigest = makeMockLoginDigest(newLoginValue);
  }

  return { ok: true, status: 200, message: 'updated', user: sanitizeUser(user) };
}

export async function deleteMockUser(id) {
  const users = store();
  const index = users.findIndex((user) => String(user.id) === String(id));

  if (index === -1) {
    return { ok: false, status: 404, message: 'user not found' };
  }

  users.splice(index, 1);
  return { ok: true, status: 200, message: 'erased' };
}

export async function checkUserCredentials(input = {}) {
  const name = String(input.name || '').trim();
  const loginValue = readLoginValue(input);
  const user = store().find((item) => item.name === name);

  if (!user) return null;
  const loginMatches = await verifyUserLogin(loginValue, user.loginDigest);
  return loginMatches ? sanitizeUser(user) : null;
}
