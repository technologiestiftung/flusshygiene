export interface IObject {
  [key: string]: any;
}

export interface IBroadcastData {
  event?: 'start' | 'end' | 'response';
  payload: IObject;
  sessionID?: string;
}
