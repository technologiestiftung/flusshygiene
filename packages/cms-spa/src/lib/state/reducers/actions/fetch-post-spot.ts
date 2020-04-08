import { handleErrors } from "./fetch-common";
import { IFetchSpotOptions } from "./../../../common/interfaces";
import {
  postSpotBegin,
  postSpotSuccess,
  postSpotFail,
} from "../spot-post-reducer";
import { fetchSingleSpot } from "./fetch-get-single-spot";
import { fetchSpots } from "./fetch-get-spots";
import history from "../../../history";
export const putSpot: (opts: IFetchSpotOptions) => void = ({
  url,
  headers,
  method,
  body,
  update,
  updateSingle,
  updateAll,
}) => {
  return (dispatch) => {
    dispatch(postSpotBegin());
    return fetch(`${url}`, { method: method, headers, body: body })
      .then(handleErrors)
      .then((res) => res.json())
      .then((json) => {
        //         console.log(json);
        dispatch(postSpotSuccess(json.success, json.error));
        if (updateSingle === true) {
          dispatch(fetchSingleSpot({ url, method: "GET", headers }));
        }
        if (updateAll === true) {
          dispatch(fetchSpots({ url, method: "GET", headers }));
        }
        if (json.message === "Bathingspot created") {
          try {
            history.push(`/badestellen/${json.data[0].id}`);
          } catch (e) {
            console.error("could not send you to the new spot", e);
          }
        }
      })
      .catch((error) => dispatch(postSpotFail(error)));
  };
};
