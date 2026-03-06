// get
// set
// delete
// update
// getAll
// setAll

import * as SecureStore from 'expo-secure-store';

export async function saveToken(key: string, value: string) {
  try {
    console.log(`${key}:${value}`);
    const formatedValue = typeof value !== 'string' ? JSON.stringify(value) : value;
    console.log(`${key}:${formatedValue}`)
    await SecureStore.setItemAsync(key, formatedValue);
  } catch (error) {
    console.error('Err while storing key', error);
  }
}
export async function getToken(key: string) {
  try {
    const value = await SecureStore.getItemAsync(key);
    const formatedValue = typeof value === 'string' ? JSON.parse(value) : value;
    return formatedValue;
  } catch (error) {
    console.error('Err while getting value', error);
  }
}

export async function deleteToken(key: string) {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error('Err while storing key', error);
  }
}
