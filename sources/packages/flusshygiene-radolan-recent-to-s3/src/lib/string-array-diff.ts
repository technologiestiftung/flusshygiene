
export const stringArrayDiff = (incoming: string[], existing: string[]) => {
  // const A: IObject = {};
  // a.forEach( (v) => {
  //   A[v] = true;
  // });
  // const c = b.filter( (v) => {
  //   return !A[v];
  // });
  // return c;
  const inSet = new Set(incoming);
  const exSet = new Set(existing);
  const res = new Set([...inSet].filter(x => !exSet.has(x)));
  return Array.from(res);
};

