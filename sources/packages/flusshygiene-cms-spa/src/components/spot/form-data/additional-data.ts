import { IFormBuildData } from '../../../lib/common/interfaces';

export const additionalData: IFormBuildData[] = [
  { name: 'waterRescue', type: 'text', label: 'Wasserrettung' },
  {
    name: 'waterRescueThroughDLRGorASB',
    type: 'checkbox',
    label: 'Wasserrettung durch DLRG oder ASB?',
    value: undefined,
  },
  {
    name: 'lifeguard',
    type: 'checkbox',
    label: 'Rettungschwimmer vor Ort',
    value: undefined,
  },
  {
    name: 'disabilityAccess',
    type: 'checkbox',
    label: 'Barrierefreie',
    value: undefined,
  },
  {
    name: 'disabilityAccessBathrooms',
    type: 'checkbox',
    label: 'Barrierefreie Waschräume',
    value: undefined,
  },
  {
    name: 'hasDisabilityAccesableEntrence',
    type: 'checkbox',
    label: 'Barrierefreier Eingang',
    value: undefined,
  },
  {
    name: 'restaurant',
    type: 'checkbox',
    label: 'Restaurant',
    value: undefined,
  },
  {
    name: 'snack',
    type: 'checkbox',
    label: 'Snack',
    value: undefined,
  },
  {
    name: 'parkingSpots',
    type: 'checkbox',
    label: 'Parkplätze',
    value: undefined,
  },
  {
    name: 'bathrooms',
    type: 'checkbox',
    label: 'Waschräume',
    value: undefined,
  },

  {
    name: 'bathroomsMobile',
    type: 'checkbox',
    label: 'Mobile Toiletten',
    value: undefined,
  },
  {
    name: 'dogban',
    type: 'checkbox',
    label: 'Hundeverbot',
    value: undefined,
  },
];
