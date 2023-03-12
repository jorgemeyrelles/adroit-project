import { useEffect, useState } from 'react';

const getStorageData = (keyName) => {
  const savedItem = localStorage.getItem(keyName);
  const parsedItem = JSON.parse(savedItem);
  return parsedItem;
};

const setStorageData = (keyName, defaultValue) => {
  const stringifyItem = JSON.stringify(defaultValue);
  return localStorage.setItem(keyName, stringifyItem);
};

const updateLocalStorage = (keyName, defaultValue) => {
  const fromLocal = getStorageData(keyName);
  if (fromLocal) {
    fromLocal.unshift(defaultValue);
    setStorageData(keyName, fromLocal);
  } else {
    setStorageData(keyName, [defaultValue]);
  }
};

export const useLocalStorage = (keyName, initialValue) => {
  const [value, setValue] = useState(keyName);

  useEffect(() => {
    if (!initialValue) {
      getStorageData(keyName);
    } else if (initialValue && !getStorageData(keyName)) {
      setStorageData(keyName, initialValue);
    }
  }, [keyName, value]);

  return [value, setValue];
};

export const storage = {
  get: (keyName) => getStorageData(keyName),
  set: (keyName, defaultValue) => setStorageData(keyName, defaultValue),
  update: (keyName, defaultValue) => updateLocalStorage(keyName, defaultValue),
  clean: () => localStorage.clear(),
};
