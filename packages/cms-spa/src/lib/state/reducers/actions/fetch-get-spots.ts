// Async fetch in redux-thunk based on
// https://daveceddia.com/where-fetch-data-redux/
// https://redux.js.org/advanced/async-actions
//
// alternative https://redux-saga.js.org/
import {
  fetchSpotsBegin,
  fetchSpotsSuccess,
  fetchSpotsFail,
} from '../spots-reducer';
import { IFetchSpotOptions } from '../../../common/interfaces';
import { handleErrors } from './fetch-common';

let skip = 0;
const limit = 50;
// const headers = {};

export const fetchSpots: (opts: IFetchSpotOptions) => void = ({
  url,
  headers,
  method,
}) => {
  return (dispatch) => {
    dispatch(fetchSpotsBegin());
    return fetch(`${url}?skip=${skip}&limit=${limit}`, {
      method: method,
      headers,
    })
      .then(handleErrors)
      .then((res) => res.json())
      .then((json) => {
        if (json.truncated === true) {
          skip += limit;
        } else {
          skip = 0;
        }
        dispatch(fetchSpotsSuccess(json.data, json.truncated));
      })
      .catch((error) => dispatch(fetchSpotsFail(error)));
  };
};
