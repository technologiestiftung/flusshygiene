import {
  // IFetchSpotOptions,

  IApiAction,
  ApiActionTypes,
  RequestTypes,
  RequestResourceTypes,
} from '../common/interfaces';

export function actionCreator({
  url,
  type,
  method,
  resource,
  token,
}: {
  url: string;
  type: ApiActionTypes;
  method: RequestTypes;
  resource: RequestResourceTypes;
  token: string;
}): IApiAction {
  const action: IApiAction = {
    type,
    payload: {
      config: {
        method,
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      },
      url,
      requestType: { type: method, resource },
    },
  };
  return action;
}
