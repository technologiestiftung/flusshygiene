import { getConnection } from 'typeorm';
import { entityFields } from '../types-interfaces';

const getPropertyNames = async (enititySchema: string) => {
  return getConnection().getMetadata(enititySchema).ownColumns.map(column => column.propertyName);

};

const getPropertTypeList = async (entitiySchema: string) => {
  return getConnection().getMetadata(entitiySchema).ownColumns.map(column => [column.propertyName, column.type]);
};

const setNotAllowdProps = (type: string): string[] => {
  let res: string[] = [];
  switch (type) {
    case 'Bathingspot':
    res = ['id', 'user'];
    break;
    case 'User':
    res = ['id'];
    break;
    case 'Region':
    res = ['id'];
    break;
  }
  return res;
};
export const getEntityFields: entityFields = async (type) => {
  let propertyNames;
  let propertyTypeList;
  const notAllowedProps: string[] =  setNotAllowdProps(type);
  let filteredPropNames: string[] = [];
  try {
    propertyNames = await getPropertyNames(type);
    propertyTypeList = await getPropertTypeList(type);
    const lookupMap = new Map();
    propertyTypeList.forEach(ele => {
        lookupMap.set(ele[0], ele[1]);
      });
    filteredPropNames = propertyNames.filter(ele => notAllowedProps.includes(ele) !== true);

  } catch (e) {
    throw e;
  }
  return {props: filteredPropNames, types: propertyTypeList};
};
