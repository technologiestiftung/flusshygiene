import { IBathingspot } from '../common/interfaces';

export const nullValueTransform: (spot: IBathingspot) => IBathingspot = (
  spot,
) => {
  // const explicitRemove = ['models', 'user', 'measurements'];

  // for (const key in spot) {
  //   if (explicitRemove.includes(key)) {
  //     delete spot[key];
  //   }
  // }
  const matchPatterns = {
    hasPrediction: { type: 'boolean' },
    detailId: { type: 'number' },
    oldId: { type: 'number' },
    measuringPoint: { type: 'string' },
    name: { type: 'string' },
    nameLong: { type: 'string' },
    nameLong2: { type: 'string' },
    water: { type: 'string' },
    district: { type: 'string' },
    street: { type: 'string' },
    postalCode: { type: 'number' },
    category: { type: 'string' },
    city: { type: 'string' },
    website: { type: 'string' },
    cyanoPossible: { type: 'boolean' },
    healthDepartment: { type: 'string' },
    healthDepartmentAddition: { type: 'string' },
    healthDepartmentStreet: { type: 'string' },
    healthDepartmentPostalCode: { type: 'number' },
    healthDepartmentCity: { type: 'string' },
    healthDepartmentMail: { type: 'string' },
    healthDepartmentPhone: { type: 'string' },
    waterRescueThroughDLRGorASB: { type: 'boolean' },
    waterRescue: { type: 'string' },
    lifeguard: { type: 'boolean' },
    hasDisabilityAccesableEntrence: { type: 'boolean' },
    disabilityAccess: { type: 'boolean' },
    disabilityAccessBathrooms: { type: 'boolean' },
    restaurant: { type: 'boolean' },
    snack: { type: 'boolean' },
    parkingSpots: { type: 'boolean' },
    bathrooms: { type: 'boolean' },
    bathroomsMobile: { type: 'boolean' },
    dogban: { type: 'boolean' },
    lastClassification: { type: 'string' },
    image: { type: 'string' },
    apiEndpoints: { type: 'string' },
    state: { type: 'string' },
    latitude: { type: 'number' },
    longitude: { type: 'number' },
    elevation: { type: 'number' },
    region: { type: 'string' },
  };

  for (const spotKey in spot) {
    for (const patternKey in matchPatterns) {
      if (spotKey === patternKey && spot[spotKey] === null) {
        switch (matchPatterns[patternKey].type) {
          case 'boolean':
            spot[spotKey] = undefined;
            break;
          case 'number':
            spot[spotKey] = undefined;
            break;
          case 'string':
            spot[spotKey] = '';
            break;
          // default:
          //   spot[spotKey] = undefined;
          //   break;
        }
      }
    }
  }
  return spot;
};
