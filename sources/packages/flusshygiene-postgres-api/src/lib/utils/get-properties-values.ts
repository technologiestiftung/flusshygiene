import { GetPropsValueGeneric } from '../types-interfaces';

// /**
//  * assumes that you want true or false as result
//  * if the prop does not exists or is false it returns false
//  * if it is true it returns true
//  * @param obj the object to check
//  * @param key thekey to look for
//  * @returns boolean
//  */
// export const getBooleanPropsValue: (obj: any, key: string) => boolean = (obj, key) => {
//   let res = false;
//   if (obj.hasOwnProperty(key) === true) {
//     res = obj[key];
//   }
//   return res;
// };

/**
 * Get values in a generic vay usage
 *
 * `const hasForce = getPropsValueGeneric<boolean>(request.body, 'force');`
 *
 * @param obj theobjrct to inspect
 * @param key the key to lookfor
 */
export const getPropsValueGeneric: GetPropsValueGeneric = (obj, key) => {
  if (obj.hasOwnProperty(key) === true) {
    return obj[key];
  }
};
