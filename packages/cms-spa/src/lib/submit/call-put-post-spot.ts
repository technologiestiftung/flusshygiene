import {
  IBathingspot,
  IBathingspotMeasurement,
  IFetchSpotOptions,
} from "../common/interfaces";

import { REACT_APP_API_HOST } from "../config";

import { APIMountPoints, ApiResources } from "../common/enums";

import { putSpot } from "../state/reducers/actions/fetch-post-spot";
import { useAuth0 } from "../auth/react-auth0-wrapper";
import { nullValueTransform } from "../utils/spot-nullvalue-transformer";
import { useDispatch } from "react-redux";
const { user, getTokenSilently } = useAuth0();

// ╦═╗┌─┐┌┬┐┬ ┬─┐ ┬
// ╠╦╝├┤  │││ │┌┴┬┘
// ╩╚═└─┘─┴┘└─┘┴ └─
const dispatch = useDispatch();

export const callPutPostSpot = async (
  spot: IBathingspot,
  initialSpot: IBathingspot,
  isNewSpot?: boolean,
  measurmentData?: IBathingspotMeasurement[],
) => {
  const transformedSpot = nullValueTransform(initialSpot);
  const token = await getTokenSilently();
  const { id, createdAt, version, updatedAt, ...body } = spot;
  // console.log(measurmentData);
  // console.log('unpatched body', body);
  for (const key in body) {
    // if (typeof body[key] === 'string') {
    //   if (body[key].length === 0) {
    //     delete body[key];
    //   }
    // }
    if (key === "csvFile") {
      delete body[key];
    }
    if (key === "isPublic") {
      continue;
    }
    if (key === "location" || key === "area") {
      continue;
    }
    if (body[key] === null || body[key] === undefined) {
      delete body[key];
    }
    if (body[key] === transformedSpot[key]) {
      delete body[key];
    }
  }

  // console.log('patched body ', body);

  let url: string;

  if (isNewSpot === true) {
    url = `${REACT_APP_API_HOST}/${APIMountPoints.v1}/${ApiResources.users}/${user.pgapiData.id}/${ApiResources.bathingspots}`;
  } else {
    url = `${REACT_APP_API_HOST}/${APIMountPoints.v1}/${ApiResources.users}/${user.pgapiData.id}/${ApiResources.bathingspots}/${spot.id}`;
  }
  const postSpotOpts: IFetchSpotOptions = {
    method: isNewSpot === true ? "POST" : "PUT",
    url,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
    update: true,
  };

  // console.log('post options', postSpotOpts);

  dispatch(putSpot(postSpotOpts));
  if (
    isNewSpot === false ||
    (isNewSpot === undefined &&
      measurmentData !== undefined &&
      measurmentData.length > 0)
  ) {
    //     console.log('posting measurements');
    const postMeasurmentsOpts: IFetchSpotOptions = {
      method: "POST",
      url: `${REACT_APP_API_HOST}/${APIMountPoints.v1}/${ApiResources.users}/${user.pgapiData.id}/${ApiResources.bathingspots}/${spot.id}/${ApiResources.measurements}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(measurmentData),
      update: false,
    };
    dispatch(putSpot(postMeasurmentsOpts));
  }
};
