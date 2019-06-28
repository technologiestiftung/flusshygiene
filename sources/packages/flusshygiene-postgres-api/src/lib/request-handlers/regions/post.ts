// import {geojsonhint} from '@mapbox/geojsonhint';
// tslint:disable-next-line: no-var-requires
// const GeoJSON = require('geojson');
import { getRepository } from 'typeorm';
import { Region } from '../../../orm/entity/Region';
import { SUCCESS } from '../../messages';
import { HttpCodes, postResponse } from '../../common';
import { getEntityFields } from '../../utils';
import { createMergeObj } from '../../utils/regions-helper';
// import { getGEOJsonGeometry } from '../../utils/geojson/get-geojson-geometry';
import { errorResponse, responder, responderMissingBodyValue, successResponse } from '../responders';

export const postRegion: postResponse = async (request, response) => {
  try {
    const example = await getEntityFields('Region');
    const regionRepo = getRepository(Region);
    if (request.body.hasOwnProperty('name') !== true) {
      responderMissingBodyValue(response, example);
    } else if (request.body.hasOwnProperty('displayName') !== true) {
      responderMissingBodyValue(response, example);
    } else {

      const region = new Region();
      // if (request.body.hasOwnProperty('area') === true) {
      //     console.log('we have some area');
      //     if (isObject(request.body.area) === true) {
      //       // const geojson = GeoJSON.parse(request.body.area, {Polygon: 'polygon'} );
      //       // console.log('this is the parsed geojson', JSON.stringify(geojson.geometry));
      //       region.area = request.body.area.geometry;
      //     }
      //   }
      // const geom = getGEOJsonGeometry(request.body, 'area');
      // if (geom !== undefined) {
      //   region.area = geom;
      // }
      // region.name = request.body.name;
      // region.displayName = request.body.displayName;
      const obj = createMergeObj(request.body);
      regionRepo.merge(region, obj);
      const res = await regionRepo.save(region);
      responder(response, HttpCodes.successCreated, successResponse(SUCCESS.success201, [res]));
    }
  } catch (e) {
    response.status(HttpCodes.internalError).json(errorResponse(e));
  }
};
