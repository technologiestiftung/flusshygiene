import { IObject } from './../common/interfaces';

const arrayGetlastElements: (arr: any[], num: number) => any[] = (arr, num) => {
  const res = arr.slice(Math.max(arr.length - num, 0));
  return res;
};

const genericArrayGetlastElements: <T>(arr: T[], num: number) => T[] = (
  arr,
  num,
) => {
  const res = arr.slice(Math.max(arr.length - num, 0));
  return res;
};
const arraySortByDateField = (a: IObject, b: IObject) => {
  return (
    ((new Date(a.date) as unknown) as number) -
    ((new Date(b.date) as unknown) as number)
  );
};
export {
  arrayGetlastElements as lastElements,
  arraySortByDateField,
  genericArrayGetlastElements as genericLastElements,
};
