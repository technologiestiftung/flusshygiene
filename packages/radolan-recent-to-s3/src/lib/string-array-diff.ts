export const stringArrayDiff = (
  incoming: string[],
  existing: string[],
): string[] => {
  const inSet = new Set(incoming);
  const exSet = new Set(existing);
  const res = new Set([...inSet].filter((x) => !exSet.has(x)));
  return Array.from(res);
};
