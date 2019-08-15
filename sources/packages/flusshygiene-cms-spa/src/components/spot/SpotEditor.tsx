import React from 'react';
import { Formik, Form } from 'formik';
import SpotEditorInput from './SpotEditorInput';
import SpotEditorCheckbox from './SpotEditorCheckbox';
import * as Yup from 'yup';
import { IBathingspot } from '../../lib/common/interfaces';

function postalCodeValidator(value: number) {
  return /^([0]{1}[1-9]{1}|[1-9]{1}[0-9]{1})[0-9]{3}$/.test(value.toString());
}

const editorSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Mehr als drei Buchstaben')
    .max(255, 'Nicht mehr als 255 Buchstaben')
    .required('Nicht optional'),
  nameLong: Yup.string()
    .min(3, 'Mehr als drei Buchstaben')
    .max(255, 'Nicht mehr als 255 Buchstaben'),
  water: Yup.string()
    .min(3, 'Mehr als drei Buchstaben')
    .max(255, 'Nicht mehr als 255 Buchstaben'),
  district: Yup.string()
    .min(3, 'Mehr als drei Buchstaben')
    .max(255, 'Nicht mehr als 255 Buchstaben'),
  street: Yup.string()
    .min(3, 'Mehr als drei Buchstaben')
    .max(255, 'Nicht mehr als 255 Buchstaben'),
  postalCode: Yup.number()
    .positive()
    .integer()
    .test('number-regex', 'Keine valide Postleitzahl', postalCodeValidator),
  city: Yup.string()
    .min(3, 'Mehr als drei Buchstaben')
    .max(255, 'Nicht mehr als 255 Buchstaben'),
  healthDepartment: Yup.string()
    .min(3, 'Mehr als drei Buchstaben')
    .max(255, 'Nicht mehr als 255 Buchstaben'),
  healthDepartmentAddition: Yup.string()
    .min(3, 'Mehr als drei Buchstaben')
    .max(255, 'Nicht mehr als 255 Buchstaben'),
  healthDepartmentStreet: Yup.string()
    .min(3, 'Mehr als drei Buchstaben')
    .max(255, 'Nicht mehr als 255 Buchstaben'),
  healthDepartmentPostalCode: Yup.number()
    .positive()
    .integer()
    .test('number-regex', 'Keine valide Postleitzahl', postalCodeValidator),
  healthDepartmentCity: Yup.string()
    .min(3, 'Mehr als drei Buchstaben')
    .max(255, 'Nicht mehr als 255 Buchstaben'),
  healthDepartmentMail: Yup.string().email(
    'Bitte geben Sie eine valide E-Mail an',
  ),
  healthDepartmentPhone: Yup.string()
    .min(3, 'Mehr als drei Buchstaben')
    .max(255, 'Nicht mehr als 255 Buchstaben'),
  waterRescueThroughDLRGorASB: Yup.boolean(),
  waterRescue: Yup.string()
    .min(3, 'Mehr als drei Buchstaben')
    .max(255, 'Nicht mehr als 255 Buchstaben'),
  lifeguard: Yup.boolean(),
  hasDisabilityAccesableEntrence: Yup.boolean(),
  disabilityAccess: Yup.boolean(),
  disabilityAccessBathrooms: Yup.boolean(),
  restaurant: Yup.boolean(),
  snack: Yup.boolean(),
  parkingSpots: Yup.boolean(),
  cyanoPossible: Yup.boolean(),
  bathrooms: Yup.boolean(),
  bathroomsMobile: Yup.boolean(),
  dogban: Yup.boolean(),
  website: Yup.string().url('Bitte geben Sie eine valide url ein'),
  lastClassification: Yup.string(),
  image: Yup.string().url('Bitte geben Sie eine valide url ein'),
  apiEndpoints: Yup.string(),
  latitude: Yup.number()
    .min(-90, 'Kleiner als -90')
    .max(90, 'Größer als 90'),
  longitude: Yup.number()
    .min(-180, 'Kleiner als -180')
    .max(180, 'Größer als 180'),
  elevation: Yup.number(),
  region: Yup.string()
    .min(3, 'Mehr als drei Buchstaben')
    .max(255, 'Nicht mehr als 255 Buchstaben'),
});

const SpotEditor: React.SFC<{
  spot: IBathingspot;
  handleEditModeClick: any;
}> = ({ spot, handleEditModeClick }) => {
  for (const key in spot) {
    if (spot[key] === null) {
      spot[key] = undefined;
    }
  }

  return (
    <div>
      <Formik
        initialValues={spot}
        validationSchema={editorSchema}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            console.log(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 500);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => {
          return (
            <div className='modal is-active'>
              <div className='modal-background'></div>
              <div className='modal-content'>
                <Form style={{ paddingTop: '10px' }}>
                  <div className='box'>
                    <fieldset>
                      <legend className='title is-5'>Basis Daten</legend>
                      <SpotEditorInput
                        name={'name'}
                        type={'text'}
                        label={'Name'}
                      />
                      <SpotEditorInput
                        name={'nameLong'}
                        type={'text'}
                        label={'Langer Name'}
                      />
                      <SpotEditorInput
                        name={'water'}
                        type={'text'}
                        label={'Gewässer'}
                      />
                      <SpotEditorInput
                        name={'district'}
                        type={'text'}
                        label={'Distrikt'}
                      />
                      <SpotEditorInput
                        name={'street'}
                        type={'text'}
                        label={'Straße'}
                      />
                      <SpotEditorInput
                        name={'postalCode'}
                        type={'number'}
                        label={'Postleitzahl'}
                      />
                      <SpotEditorInput
                        name={'city'}
                        type={'text'}
                        label={'Stadt'}
                      />
                      <SpotEditorInput
                        name={'website'}
                        type={'text'}
                        label={'Website URL'}
                      />
                      <SpotEditorInput
                        name={'lastClassification'}
                        type={'text'}
                        label={'Letzte Klassifizierung'}
                      />
                      <SpotEditorInput
                        name={'image'}
                        type={'text'}
                        label={'Bild URL'}
                      />
                      <SpotEditorInput
                        name={'latitude'}
                        type={'number'}
                        label={'Latitude'}
                      />
                      <SpotEditorInput
                        name={'longitude'}
                        type={'number'}
                        label={'Longitude'}
                      />
                      <SpotEditorInput
                        name={'elevation'}
                        type={'number'}
                        label={'Höhe über NN'}
                      />
                      <SpotEditorInput
                        name={'apiEndpoints'}
                        type={'number'}
                        label={'API Endpoints'}
                      />
                      <SpotEditorCheckbox
                        name={'cyanoPossible'}
                        type={'checkbox'}
                        label={'Cyanobakterien möglich'}
                      />
                    </fieldset>
                  </div>
                  <div className='box'>
                    <fieldset>
                      <legend className='title is-5'>
                        Zuständiges Gesundheitsamt
                      </legend>
                      <SpotEditorInput
                        name={'healthDepartment'}
                        type={'text'}
                        label={'Name'}
                      />
                      <SpotEditorInput
                        name={'healthDepartmentAddition'}
                        type={'text'}
                        label={'Zusatz'}
                      />
                      <SpotEditorInput
                        name={'healthDepartmentStreet'}
                        type={'text'}
                        label={'Straße'}
                      />
                      <SpotEditorInput
                        name={'healthDepartmentPostalCode'}
                        type={'number'}
                        label={'Postleitzahl'}
                      />
                      <SpotEditorInput
                        name={'healthDepartmentPostalCode'}
                        type={'text'}
                        label={'Stadt'}
                      />
                      <SpotEditorInput
                        name={'healthDepartmentMail'}
                        type={'email'}
                        label={'E-Mail'}
                      />
                      <SpotEditorInput
                        name={'healthDepartmentPhone'}
                        type={'email'}
                        label={'Telefonnummer'}
                      />
                    </fieldset>
                  </div>
                  <div className='box'>
                    <fieldset>
                      <legend className='title is-5'>Zusatz Daten</legend>
                      <SpotEditorInput
                        name={'waterRescue'}
                        type={'email'}
                        label={'Wasserrettung'}
                      />
                      <SpotEditorCheckbox
                        name={'waterRescueThroughDLRGorASB'}
                        type={'checkbox'}
                        label={'Wasserrettung durch DLRG oder ASB?'}
                      />
                      <SpotEditorCheckbox
                        name={'lifeguard'}
                        type={'checkbox'}
                        label={'Rettungschwimmer vor Ort'}
                      />
                      <SpotEditorCheckbox
                        name={'disabilityAccess'}
                        type={'checkbox'}
                        label={'Barrierefreie'}
                      />
                      <SpotEditorCheckbox
                        name={'disabilityAccessBathrooms'}
                        type={'checkbox'}
                        label={'Barrierefreie Waschräume'}
                      />
                      <SpotEditorCheckbox
                        name={'hasDisabilityAccesableEntrence'}
                        type={'checkbox'}
                        label={'Barrierefreier Eingang'}
                      />
                      <SpotEditorCheckbox
                        name={'restaurant'}
                        type={'checkbox'}
                        label={'Restaurant'}
                      />
                      <SpotEditorCheckbox
                        name={'snack'}
                        type={'checkbox'}
                        label={'Snack'}
                      />
                      <SpotEditorCheckbox
                        name={'parkingSpots'}
                        type={'checkbox'}
                        label={'Parkplätze'}
                      />
                      <SpotEditorCheckbox
                        name={'bathrooms'}
                        type={'checkbox'}
                        label={'Waschräume'}
                      />

                      <SpotEditorCheckbox
                        name={'bathroomsMobile'}
                        type={'checkbox'}
                        label={'Mobile Toiletten'}
                      />
                      <SpotEditorCheckbox
                        name={'dogBan'}
                        type={'checkbox'}
                        label={'Hundeverbot'}
                      />
                    </fieldset>
                  </div>
                  <div className='field is-grouped is-grouped-right'>
                    <p className='control'>
                      <button
                        className='button is-primary'
                        type='submit'
                        disabled={isSubmitting}
                      >
                        Speichern
                      </button>
                    </p>
                    <p className='control'>
                      <button
                        className='button is-is-light'
                        type='button'
                        disabled={isSubmitting}
                        onClick={handleEditModeClick}
                      >
                        Abbrechen
                      </button>
                    </p>
                  </div>
                </Form>
              </div>
              <button
                className='modal-close is-large'
                aria-label='close'
                onClick={handleEditModeClick}
              ></button>
            </div>
          );
        }}
      </Formik>
    </div>
  );
};

export default SpotEditor;
