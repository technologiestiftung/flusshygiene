// see https://codepen.io/hyvyys/pen/pozwzEq?editors=0010
// https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-only-if-necessary
export const roundTo = (num: number, precision: number): number => {
  const f = 10 ** precision;
  return Math.round((num + Number.EPSILON) * f) / f;
};
