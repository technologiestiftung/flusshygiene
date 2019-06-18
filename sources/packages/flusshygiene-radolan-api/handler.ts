import { APIGatewayEvent, Context, Handler } from 'aws-lambda';
import AWS, { S3 } from 'aws-sdk';
import moment, { Moment } from 'moment';
import { allBucketKeys } from './all-bucket-keys';
import { IDaysObject } from './common';
// tslint:disable-next-line: no-var-requires
const momentRange = require('moment-range');
const mom = momentRange.extendMoment(moment);

const s3 = new AWS.S3();
// const BUCKET_NAME = 'flusshygiene-radolan-data';
const flatten = (arr: any[][]) => {
  return Array.prototype.concat(...arr);
};

// const pubUrl = process.env.RADOLAN_DATA_BUCKET_PUBLIC_URL;
export const radolan: Handler = async (event: APIGatewayEvent, _context: Context) => {
  try {
    if (event === undefined) {
      console.error('Event not defined');
      throw new Error(`event was not defined`);
    }
    const queryParams = event.queryStringParameters;
    const noQueryParamsErrorMessage = `There are no url query paramters defined.
E.g. http://example.com?from=20190101&to=20190131`;

    if (queryParams === undefined || queryParams === null) {
      console.error('Params not defined');
      throw new Error(noQueryParamsErrorMessage);
    }
    let from: string | undefined;
    let to: string | undefined;
    if (['from', 'to'].every((p) => p in queryParams) === false) {
      console.error('Params not defined');
      throw new Error(noQueryParamsErrorMessage);
    }

    from = queryParams.from;
    to = queryParams.to;

    if (from === undefined || to === undefined) {
      console.error('Params not defined');
      throw new Error(noQueryParamsErrorMessage);

    }

    const reg = /^(?<year>\d{4})(?<month>\d{2})(?<day>\d{2})/;
    const matchFrom: RegExpMatchArray | null = from.match(reg);
    const matchTo: RegExpMatchArray | null = to.match(reg);
    const props: string[] = ['year', 'month', 'day'];

    if (matchFrom === null ||
      matchTo === null ||
      matchFrom.groups === undefined ||
      matchTo.groups === undefined ||
      props.every((p: string) => p in matchFrom.groups!) === false ||
      props.every((p: string) => p in matchTo.groups!) === false
    ) {
      console.error('Could not match');

      throw new Error(
        `Could not match dates in the from and to url query paramters.
Should be YYYYMMDD for both.
E.g from=20190101&to=20190131`);
    }

    // console.log('match from', matchFrom);
    // console.log('match to', matchTo);
    /**
     * @description We need to shift the date from 01 based to 00 based
     */
    const start = new Date(
      parseInt(matchFrom.groups.year, 10),
      parseInt(matchFrom.groups.month, 10) - 1,
      parseInt(matchFrom.groups.day, 10),
    );
    const end = new Date(
      parseInt(matchTo.groups.year, 10),
      parseInt(matchTo.groups.month, 10) - 1,
      parseInt(matchTo.groups.day, 10),
    );
    const range = mom.range(start, end);
    // console.log(range);
    const days: Moment[] = Array.from(range.by('days'));

    /**
     * @description Used ot build the prefiy for accessing the radolan data.
     * This is not a real date operation anymore. We are shifting the values around.
     * @todo fix Y3K bug
     */
    const daysDate: IDaysObject[] = days.map((d) => {
      // some magic transformations
      // remove the 2000 from the years this is a Y3K bug
      // the month is 0 based so it is + 1 to match our months on the s3
      // feels a little odd to shift this around but the user will not
      // work with 00 based dates
      return { year: d.get('year') - 2000, month: d.get('month') + 1, day: d.get('date') };
    },
    );
    const s3Lists: S3.ObjectList[] = [];
    const s3ListingTasks = daysDate.map((dto: IDaysObject) => new Promise(async (resolve, reject) => {
      try {
        const year = (dto.year.toString()).padStart(2, '0');
        const month = ((dto.month).toString()).padStart(2, '0');
        const day = (dto.day.toString()).padStart(2, '0');
        const prefix = `${year}/${month}/${day}`;
        console.log(prefix);
        const data: S3.ObjectList = await allBucketKeys(s3, process.env.RADOLAN_DATA_BUCKET!, prefix);
        // console.log(data);
        s3Lists.push(data);
        resolve();
      } catch (err) {
        reject(err);
      }
    }));
    await Promise.all(s3ListingTasks).catch((err) => {
      throw err;
    });
    const flatS3List = flatten(Array.from(s3Lists));
    const cleanedFlatS3List = flatS3List.map((ele) => {
      return {
        key: ele.Key,
        url: `${process.env.RADOLAN_DATA_BUCKET_PUBLIC_URL}/${ele.Key}`,
      };
    });
    console.log(cleanedFlatS3List);
    const response = {
      body: JSON.stringify({
        dates: daysDate,
        files: cleanedFlatS3List,
        input: event,
      }),
      statusCode: 200,
    };
    return response;
  } catch (error) {
    console.error('Global catch');
    console.error(error.message);
    return {
      body: JSON.stringify({
        input: event,
        message: error.message,
      }),
      statusCode: 404,
    };
  }
};
