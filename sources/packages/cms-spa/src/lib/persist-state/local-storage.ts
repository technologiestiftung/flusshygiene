import { IObject } from '../common/interfaces';

/**
 * Loads the stored data from local storage
 */
export const loadState: (key: string) => IObject | undefined = (key) => {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

/**
 * Saves an object to local storage under a specific key
 */
export const saveState: (key: string, state: IObject) => void = (
  key,
  state,
) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(key, serializedState);
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.error(err);
  }
};

export const clearState: (key: string) => void = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(error);
  }
};
