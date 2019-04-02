import { isObject } from '.';
import { IObject } from '../types-interfaces';

const criteria = [
  {type: 'string', key: 'name'},
  {type: 'string', key: 'displayName'},
  {type: 'object', key: 'area'},
];
export const createMergeObj: (obj: any) => IObject = (obj) => {
  const res: IObject = {};

  criteria.forEach((criterion) => {
    const value = obj[criterion.key];
    switch (criterion.type) {
      case 'object':
      if (isObject(value)) {
        res.area = value.geometry;
      }
      break;
      default:
      if (typeof value === criterion.type) {
        res[criterion.key] = value;
      }
    }
  });
  return res;
};
