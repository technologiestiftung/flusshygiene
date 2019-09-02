import * as Yup from 'yup';

export const editorSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Mehr als drei Buchstaben')
    .max(255, 'Nicht mehr als 255 Buchstaben')
    .required('Nicht optional'),
  nameLong: Yup.string()
    .min(3, 'Mehr als drei Buchstaben')
    .max(255, 'Nicht mehr als 255 Buchstaben')
    .nullable(),
  water: Yup.string()
    .min(3, 'Mehr als drei Buchstaben')
    .max(255, 'Nicht mehr als 255 Buchstaben')
    .nullable(),
  district: Yup.string()
    .min(3, 'Mehr als drei Buchstaben')
    .max(255, 'Nicht mehr als 255 Buchstaben')
    .nullable(),
  street: Yup.string()
    .min(3, 'Mehr als drei Buchstaben')
    .max(255, 'Nicht mehr als 255 Buchstaben')
    .nullable(),
  postalCode: Yup.number()
    .positive()
    .integer()
    .nullable(),
  // .test('number-regex', 'Keine valide Postleitzahl', postalCodeValidator),
  city: Yup.string()
    .min(3, 'Mehr als drei Buchstaben')
    .max(255, 'Nicht mehr als 255 Buchstaben')
    .nullable(),
  healthDepartment: Yup.string()
    .min(3, 'Mehr als drei Buchstaben')
    .max(255, 'Nicht mehr als 255 Buchstaben')
    .nullable(),
  healthDepartmentAddition: Yup.string()
    .min(3, 'Mehr als drei Buchstaben')
    .max(255, 'Nicht mehr als 255 Buchstaben')
    .nullable(),
  healthDepartmentStreet: Yup.string()
    .min(3, 'Mehr als drei Buchstaben')
    .max(255, 'Nicht mehr als 255 Buchstaben')
    .nullable(),
  healthDepartmentPostalCode: Yup.number()
    .positive()
    .integer()
    .nullable(),

  // .test('number-regex', 'Keine valide Postleitzahl', postalCodeValidator),
  healthDepartmentCity: Yup.string()
    .min(3, 'Mehr als drei Buchstaben')
    .max(255, 'Nicht mehr als 255 Buchstaben')
    .nullable(),
  healthDepartmentMail: Yup.string()
    .email('Bitte geben Sie eine valide E-Mail an')
    .nullable(),
  healthDepartmentPhone: Yup.string()
    .min(3, 'Mehr als drei Buchstaben')
    .max(255, 'Nicht mehr als 255 Buchstaben')
    .nullable(),
  waterRescueThroughDLRGorASB: Yup.boolean().nullable(),
  waterRescue: Yup.string()
    .min(3, 'Mehr als drei Buchstaben')
    .max(255, 'Nicht mehr als 255 Buchstaben')
    .nullable(),
  lifeguard: Yup.boolean().nullable(),
  hasDisabilityAccesableEntrence: Yup.boolean().nullable(),
  disabilityAccess: Yup.boolean().nullable(),
  disabilityAccessBathrooms: Yup.boolean().nullable(),
  restaurant: Yup.boolean().nullable(),
  snack: Yup.boolean().nullable(),
  parkingSpots: Yup.boolean().nullable(),
  cyanoPossible: Yup.boolean().nullable(),
  bathrooms: Yup.boolean().nullable(),
  bathroomsMobile: Yup.boolean().nullable(),
  dogban: Yup.boolean().nullable(),
  website: Yup.string()
    .url('Bitte geben Sie eine valide url ein')
    .nullable(),
  lastClassification: Yup.string().nullable(),
  image: Yup.string()
    .url('Bitte geben Sie eine valide url ein')
    .nullable(),
  apiEndpoints: Yup.string().nullable(),
  latitude: Yup.number()
    .min(-90, 'Kleiner als -90')
    .max(90, 'Größer als 90')
    .required('Bitte geben sie einen Wert für Latitide ein (z.B. 13.0123)'),
  longitude: Yup.number()
    .min(-180, 'Kleiner als -180')
    .max(180, 'Größer als 180')
    .required('Bitte geben sie einen Wert für Longitude ein (z.B. 52.0123)'),
  elevation: Yup.number().nullable(),
  region: Yup.string()
    .min(3, 'Mehr als drei Buchstaben')
    .max(255, 'Nicht mehr als 255 Buchstaben')
    .nullable(),
  influencePurificationPlant: Yup.string().default('unknown'),
  influenceCombinedSewerSystem: Yup.string().default('unknown'),
  influenceRainwater: Yup.string().default('unknown'),
  influenceAgriculture: Yup.string().default('unknown'),
});

export const measurementsSchema = Yup.object().shape({
  date: Yup.date().required(),
  conc_ie: Yup.number()
    .integer()
    .positive()
    .required(),
  conc_ec: Yup.number()
    .integer()
    .positive()
    .required(),
});
