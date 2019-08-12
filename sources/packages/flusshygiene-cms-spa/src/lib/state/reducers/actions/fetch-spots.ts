import {
  fetchSpotsBegin,
  fetchSpotsSuccess,
  fetchSpotsFail,
} from './../spots-reducer';
const handleErrors = (response: Response) => {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
};

let skip = 0;
const limit = 50;
const headers = {};
export const fetchSpots = () => {
  return (dispatch: (...args) => void) => {
    dispatch(fetchSpotsBegin());
    return fetch(
      `http://flsshygn-dev.eu-central-1.elasticbeanstalk.com/api/v1/bathingspots?skip=${skip}&limit=${limit}`,
      { method: 'GET', headers },
    )
      .then(handleErrors)
      .then((res) => res.json())
      .then((json) => {
        if (json.truncated === true) {
          console.log('truncated', json.truncated);
          console.log('skip', skip);

          skip += limit;
        } else {
          console.log('not truncated', json.truncated);
          skip = 0;
        }
        dispatch(fetchSpotsSuccess(json.data, json.truncated));
        // return json.data;
      })
      .catch((error) => dispatch(fetchSpotsFail(error)));
  };
};
