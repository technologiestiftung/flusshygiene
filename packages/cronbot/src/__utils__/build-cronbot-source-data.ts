import { getRandomValue } from "./get-random-value";
import { getDate } from "./get-date";
export const getData = (count: number, type?: "conc") => {
  const data = [];
  for (let i = 0; i < count; i++) {
    if (type === "conc") {
      data.push({
        date: getDate(i),
        conc_ec: getRandomValue(),
        conc_ic: getRandomValue(),
      });
    } else {
      data.push({
        date: getDate(i),
        value: getRandomValue(),
      });
    }
  }

  return data;
};
