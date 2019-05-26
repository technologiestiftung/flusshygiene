import { IRadolanFileInfo } from './interfaces';

export const radolanFilenameParser: (fn: string) => IRadolanFileInfo = (fn: string) => {
  const match = fn.match(/^.+?_\d{1,10}-(?<year>\d{2})(?<month>\d{2})(?<day>\d{2})(?<hour>\d{2})(?<minute>\d{2})/);
  // console.log(match);
  const res: IRadolanFileInfo = {
    fn,
    groups: {
      day: (match !== null) ? match.groups!.day : '',
      hour: (match !== null) ? match.groups!.hour : '',
      minute: (match !== null) ? match.groups!.minute : '',
      month: (match !== null) ? match.groups!.month : '',
      year: (match !== null) ? match.groups!.year : '',
    },
  };
  return res; // Object.assign({ fn: match.input }, match.groups);
};
