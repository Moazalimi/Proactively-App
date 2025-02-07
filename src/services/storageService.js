import AsyncStorage from '@react-native-async-storage/async-storage';

export async function setItem(key, value) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function getItem(key) {
  const val = await AsyncStorage.getItem(key);
  return val ? JSON.parse(val) : null;
}

export async function removeItem(key) {
  await AsyncStorage.removeItem(key);
}
