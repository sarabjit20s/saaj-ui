'use client';

import React from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T),
): [T, (value: T | ((prevValue: T) => T)) => void] {
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item
        ? JSON.parse(item)
        : initialValue instanceof Function
          ? initialValue()
          : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue instanceof Function ? initialValue() : initialValue;
    }
  });

  const setValue = (value: T | ((prevValue: T) => T)) => {
    try {
      const newValue = value instanceof Function ? value(storedValue) : value;
      setStoredValue(newValue);
      window.localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}
