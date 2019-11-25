export interface IObject {
  [key: string]: any;
}

export interface IBroadcastData {
  event?: 'start' | 'end';
  payload: IObject;
  sessionID?: string;
}
