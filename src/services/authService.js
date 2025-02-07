import { setItem, getItem } from './storageService';

export async function registerUser({ username, password, name, photoUri }) {
  let users = await getItem('users');
  if (!users) {
    users = [];
  }

  if (users.length >= 20) {
    throw new Error('Maximum number of users reached.');
  }

  // Check if username already exists
  if (users.some(u => u.username === username)) {
    throw new Error('Username already taken.');
  }

  const newUser = { username, password, name, photoUri };
  users.push(newUser);
  await setItem('users', users);
}

export async function login(username, password) {
  const users = await getItem('users');
  if (!users || users.length === 0) return false;

  const foundUser = users.find(u => u.username === username && u.password === password);
  if (foundUser) {
    await setItem('currentUser', foundUser.username); 
    await setItem('userLoggedIn', true);
    return true;
  }
  return false;
}

export async function getCurrentUser() {
  const username = await getItem('currentUser');
  if (!username) return null;
  const users = await getItem('users');
  if (!users) return null;
  return users.find(u => u.username === username) || null;
}

export async function updateCurrentUser(updates) {
  const username = await getItem('currentUser');
  if (!username) return null;

  let users = await getItem('users');
  const index = users.findIndex(u => u.username === username);
  if (index === -1) return null;

  users[index] = { ...users[index], ...updates };
  await setItem('users', users);
  return users[index];
}

export async function logout() {
  await setItem('userLoggedIn', false);
  await setItem('currentUser', null);
}
