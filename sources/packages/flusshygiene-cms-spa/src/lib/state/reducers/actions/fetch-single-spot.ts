import {
  fetchSingleSpotBegin,
  fetchSingleSpotSuccess,
  fetchSingleSpotFail,
} from '../single-spot-reducer';
import { IFetchSpotsOptions } from '../../../common/interfaces';
import { handleErrors } from './fetch-common';

export const fetchSingleSpot: (opts: IFetchSpotsOptions) => void = ({
  url,
  headers,
  method,
}) => {
  return (dispatch) => {
    dispatch(fetchSingleSpotBegin());
    return fetch(`${url}`, {
      method: method,
      headers,
    })
      .then(handleErrors)
      .then((res) => res.json())
      .then((json) => {
        console.log(json.data);
        dispatch(fetchSingleSpotSuccess(json.data, json.truncated));
        // return json.data;
      })
      .catch((error) => dispatch(fetchSingleSpotFail(error)));
  };
};
