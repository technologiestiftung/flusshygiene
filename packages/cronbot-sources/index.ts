// import { IncomingMessage, ServerResponse } from "http";
import { NowRequest, NowResponse } from '@now/node';

const getRandomValue = () => Math.floor(Math.random() * 1000);

const d = new Date();
const year = d.getFullYear();
const month = d.getMonth() + 1;
const day = d.getDate();
const h = d.getHours();
const m = d.getMinutes();
const s = d.getSeconds();
const getDate = (incr: number) =>
  `${year}-${month.toString().padStart(2, '0')}-${day
    .toString()
    .padStart(2, '0')} ${h.toString().padStart(2, '0')}:${m
    .toString()
    .padStart(2, '0')}:${((s + incr) % 60).toString().padStart(2, '0')}`;

export default async (req: NowRequest, res: NowResponse) => {
  let errMsg = '';
  try {
    const { type, count, err } = req.query;

    if (
      count === undefined &&
      isNaN(parseInt(count, 10)) === true &&
      err === undefined
    ) {
      errMsg =
        "Needs 'count' param e.g. '?count=100&type=conc' or '?count=100'";
      throw new Error();
    }
    if (type !== 'conc' && type !== undefined && err === undefined) {
      errMsg =
        "Only type 'conc' and no type are supported e.g. '?count=100&type=conc' or '?count=100'";
      throw new Error();
    }

    const data: any[] = [];

    for (let i = 0; i < parseInt(count as string, 10); i++) {
      if (type === 'conc') {
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
    if (err !== undefined) {
      res.status(200).send("I'm a response but not a json");
    } else {
      res.status(200).json({ data });
    }
  } catch (error) {
    console.error(error);
    res.status(400).send(errMsg);
  }
};
