import { getPropsValueGeneric } from '../get-properties-values-generic';

export const getGEOJsonGeometry: (obj: any, key: string) => object = (obj, key) => {
  const geojson = getPropsValueGeneric<{geometry: object}>(obj, key);
  return geojson.geometry;
};
