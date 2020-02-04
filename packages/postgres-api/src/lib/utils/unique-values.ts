export function unique(arr: any[], prop: string) {
  return arr.filter((obj, pos, arr) => {
    return arr.map((mapObj) => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
}
