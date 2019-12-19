import {
  // IFetchSpotOptions,

  IApiAction,
  ApiActionTypes,
  RequestTypes,
  RequestResourceTypes,
  IObject,
} from '../common/interfaces';

export function actionCreator({
  url,
  type,
  method,
  resource,
  token,
  body,
}: {
  url: string;
  type?: ApiActionTypes;
  method: RequestTypes;
  resource: RequestResourceTypes;
  token: string;
  body: IObject;
}): IApiAction {
  const action: IApiAction = {
    type: type ? type : ApiActionTypes.START_API_REQUEST,
    payload: {
      config: {
        body: JSON.stringify(body),
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
  if (method === 'GET') {
    delete action.payload.config!.body;
  }
  return action;
}
