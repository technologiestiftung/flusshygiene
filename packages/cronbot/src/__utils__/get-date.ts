export const getDate = (incr: number) => {
  const d = new Date();
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const h = d.getHours();
  const m = d.getMinutes();
  const s = d.getSeconds();
  return `${year}-${month
    .toString()
    .padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")} ${h.toString().padStart(2, "0")}:${m
    .toString()
    .padStart(2, "0")}:${((s + incr) % 60).toString().padStart(2, "0")}`;
};
