import { IFormBuildData } from './../../../lib/common/interfaces';
export const basisData: IFormBuildData[] = [
  { name: 'name', type: 'text', label: 'Name' },
  { name: 'nameLong', type: 'text', label: 'Langer Name' },
  {
    name: 'water',
    type: 'text',
    label: 'Gewässer',
  },
  { name: 'district', type: 'text', label: 'Distrikt' },
  { name: 'street', type: 'text', label: 'Straße' },
  { name: 'postalCode', type: 'number', label: 'Postleitzahl' },
  { name: 'city', type: 'text', label: 'Stadt' },
  { name: 'website', type: 'text', label: 'Website URL' },
  {
    name: 'lastClassification',
    type: 'text',
    label: 'Letzte Klassifizierung',
  },
  { name: 'image', type: 'text', label: 'Bild URL' },
  {
    name: 'latitude',
    type: 'number',
    label: 'Latitude',
  },
  { name: 'longitude', type: 'number', label: 'Longitude' },
  { name: 'elevation', type: 'number', label: 'Höhe über NN' },
  { name: 'apiEndpoints', type: 'text', label: 'API Endpoints' },
  {
    name: 'cyanoPossible',
    type: 'checkbox',
    label: 'Cyanobakterien möglich',
    value: undefined,
  },
];
