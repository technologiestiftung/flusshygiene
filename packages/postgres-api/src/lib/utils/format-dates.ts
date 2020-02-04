export const pad: (num: number) => string = (num) =>
  String(num).padStart(2, '0');
export const formatDateToString: (date: Date) => string = (date) => {
  const y = date.getFullYear();
  const mo = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const h = pad(date.getHours());
  const mi = pad(date.getMinutes());
  const s = pad(date.getSeconds());
  return `${y}-${mo}-${d} ${h}:${mi}:${s}`;
};
