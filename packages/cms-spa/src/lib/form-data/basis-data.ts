import {
  IFormBuildData,
  IBathingspotExtend,
  // IGeoJsonGeometry,
  MapEditModes,
  MapActiveEditor,
} from "../common/interfaces";
import { FormikHandlers, FormikHelpers } from "formik";
export const setupBasisData: (
  values: IBathingspotExtend,
  defaultFormikSetFieldValue?: FormikHelpers<
    IBathingspotExtend
  >["setFieldValue"],
  defaultFormikHandleChange?: FormikHandlers["handleChange"],
  editMode?: MapEditModes,
  activeEditor?: MapActiveEditor,
) => IFormBuildData[] = () =>
  // defaultFormikHandleChange,
  // defaultFormikSetFieldValue,
  // values,
  // editMode,
  // activeEditor,
  {
    const basisData: IFormBuildData[] = [
      // {
      //   name: 'name',
      //   type: 'text',
      //   label: 'Name *',
      // },
      // {
      //   name: 'isPublic',
      //   type: 'checkbox',
      //   label: 'Öffentlich einsehbar',
      //   value: undefined,
      // },
      {
        name: "cyanoPossible",
        type: "checkbox",
        label: "Cyanobakterien möglich",
        value: undefined,
      },
      { name: "nameLong", type: "text", label: "Langer Name" },
      {
        name: "water",
        type: "text",
        label: "Gewässer",
      },
      { name: "district", type: "text", label: "Distrikt" },
      { name: "street", type: "text", label: "Straße" },
      { name: "postalCode", type: "number", label: "Postleitzahl" },
      { name: "city", type: "text", label: "Stadt" },
      { name: "website", type: "text", label: "Website URL" },
      {
        name: "lastClassification",
        type: "text",
        label: "Letzte Klassifizierung",
      },
      { name: "image", type: "text", label: "Bild URL" },
      // {
      //   name: 'latitude',
      //   type: 'number',
      //   label: 'Latitude',
      //   // handleChange: (event) => {
      //   //   // if(activeEditor === 'location'){

      //   //   // }
      //   //   const location: IGeoJsonGeometry =
      //   //     values['location'] === undefined
      //   //       ? { coordinates: [], type: 'Point' }
      //   //       : values['location'];
      //   //   location.coordinates[1] = parseFloat(event.target.value);
      //   //   defaultFormikSetFieldValue('location', location);
      //   //   defaultFormikHandleChange(event);
      //   // },
      // },
      // {
      //   name: 'longitude',
      //   type: 'number',
      //   label: 'Longitude',
      //   // handleChange: (event) => {
      //   //   const location: IGeoJsonGeometry =
      //   //     values['location'] === undefined
      //   //       ? { coordinates: [], type: 'Point' }
      //   //       : values['location'];
      //   //   location.coordinates[0] = parseFloat(event.target.value);
      //   //   defaultFormikSetFieldValue('location', location);
      //   //   defaultFormikHandleChange(event);
      //   // },
      // },
      { name: "elevation", type: "number", label: "Höhe über NN" },
      { name: "apiEndpoints", type: "text", label: "API Endpoints" },
      // {
      //   name: 'cyanoPossible',
      //   type: 'checkbox',
      //   label: 'Cyanobakterien möglich',
      //   value: undefined,
      // },
    ];

    return basisData;
  };
