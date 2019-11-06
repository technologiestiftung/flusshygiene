
export interface IMainOptions {
  // fileList: ITarFileEntry[];
  // silent?: boolean;
}

export interface ITarFileEntry {
  filePath: string;
  date?: Date;
}
export interface IObject {
  [key: string]: any;
}

interface IRadolanFileGroups {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
}
export interface IRadolanFileInfo {
  fn: string;
  groups: IRadolanFileGroups;
}
