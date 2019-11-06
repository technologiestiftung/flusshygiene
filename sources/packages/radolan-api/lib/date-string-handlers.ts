import { IMatchGroupObject, IObject } from './common';

const reg = /^(?<year>\d{4})(?<month>\d{2})(?<day>\d{2})/;
const props: string[] = ['year', 'month', 'day'];

export const matchGroups: (groups: IObject | undefined) => boolean = (groups) => {
  if (groups === undefined) {
    return false;
  }
  return props.every((p: string) => p in groups);
};

export const matchDates: (dateStr: string) => RegExpMatchArray | null = (dateStr) => {
  return dateStr.match(reg);
};

/**
 * @description Builds new dates for start and end
 * We need to shift the date from 01 based to 00 based
 */
export const buildDate: (matchGroup: IMatchGroupObject) => Date = (matchGroup) => {
  return new Date(
    parseInt(matchGroup.year, 10),
    parseInt(matchGroup.month, 10) - 1,
    parseInt(matchGroup.day, 10),
  );
};
