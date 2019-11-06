import { IObject } from '../common';

export const getMatchingValues = (body: any, propNames: string[]): IObject => {
  const matchingValues = Object.keys(body)
    .filter((key) => propNames.includes(key))
    .reduce((obj: any, key: string) => {
      obj[key] = body[key];
      return obj;
    }, {});
  return matchingValues;
};
