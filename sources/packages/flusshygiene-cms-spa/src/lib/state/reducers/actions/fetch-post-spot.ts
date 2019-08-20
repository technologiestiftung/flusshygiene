import { handleErrors } from './fetch-common';
import { IFetchSpotOptions } from './../../../common/interfaces';
import {
  postSpotBegin,
  postSpotSuccess,
  postSpotFail,
} from '../spot-post-reducer';
import { fetchSingleSpot } from './fetch-get-single-spot';

export const putSpot: (opts: IFetchSpotOptions) => void = ({
  url,
  headers,
  method,
  body,
}) => {
  return (dispatch) => {
    dispatch(postSpotBegin());
    return fetch(`${url}`, { method: method, headers, body: body })
      .then(handleErrors)
      .then((res) => res.json())
      .then((json) => {
        dispatch(postSpotSuccess(json.success, json.error));
        dispatch(fetchSingleSpot({ url, method: 'GET', headers }));
      })
      .catch((error) => dispatch(postSpotFail(error)));
  };
};
