const formatDate = (date: Date, dateOpts: Intl.DateTimeFormatOptions) =>
  new Date(date).toLocaleDateString("de-DE", dateOpts);

// see https://codepen.io/hyvyys/pen/pozwzEq?editors=0010
// https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-only-if-necessary
const roundToFloatDigits = (num: number, precision: number): number => {
  const f = 10 ** precision;
  return Math.round((num + Number.EPSILON) * f) / f;
};

export { formatDate, roundToFloatDigits };
