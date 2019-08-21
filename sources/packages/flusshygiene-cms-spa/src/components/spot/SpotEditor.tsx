import React from 'react';
import { Formik, Form } from 'formik';
import SpotEditorInput from './SpotEditorInput';
import SpotEditorCheckbox from './SpotEditorCheckbox';
import { IBathingspot, IFetchSpotOptions } from '../../lib/common/interfaces';
import { editorSchema } from '../../lib/utils/spot-validation-schema';
import { nullValueTransform } from '../../lib/utils/spot-nullvalue-transformer';
import { SpotEditorButons } from './SpotEditor-Buttons';
import { API_DOMAIN } from '../../lib/common/constants';
import { APIMountPoints, ApiResources } from '../../lib/common/enums';
import { useAuth0 } from '../../react-auth0-wrapper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../lib/state/reducers/root-reducer';
import { putSpot } from '../../lib/state/reducers/actions/fetch-post-spot';

// function postalCodeValidator(this: any, value: any) {
//   const { path, createError } = this;
//   const res = /^([0]{1}[1-9]{1}|[1-9]{1}[0-9]{1})[0-9]{3}$/.test(
//     value.toString(),
//   );
//   console.log('in yup validation', res);
//   if (res === true || res === false) {
//     return res;
//   } else {
//     return createError({ path, message: 'Keine valide Postleitzahl' });
//   }
// }

const SpotEditor: React.FC<{
  initialSpot: IBathingspot;
  handleEditModeClick: () => void;
}> = ({ initialSpot, handleEditModeClick }) => {
  const { user } = useAuth0();
  const transformedSpot = nullValueTransform(initialSpot);
  const { getTokenSilently } = useAuth0();

  const postDone = useSelector((state: RootState) => state.postSpot.loading);
  const dispatch = useDispatch();

  const callPutSpot = async (spot: IBathingspot) => {
    const token = await getTokenSilently();
    const { id, createdAt, version, updatedAt, ...body } = spot;
    for (const key in body) {
      // if (typeof body[key] === 'string') {
      //   if (body[key].length === 0) {
      //     delete body[key];
      //   }
      // }
      if (body[key] === null) {
        delete body[key];
      }
      if (body[key] === transformedSpot[key]) {
        delete body[key];
      }
    }
    const postOpts: IFetchSpotOptions = {
      method: 'PUT',
      url: `${API_DOMAIN}/${APIMountPoints.v1}/${ApiResources.users}/${user.pgapiData.id}/${ApiResources.bathingspots}/${spot.id}`,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    };
    console.log(postOpts);
    dispatch(putSpot(postOpts));
  };

  return (
    <div>
      <Formik
        initialValues={transformedSpot}
        validationSchema={editorSchema}
        onSubmit={(values, { setSubmitting }) => {
          callPutSpot(values).catch((err) => {
            console.error(err);
          });
          console.log(postDone);
          setSubmitting(postDone);
          handleEditModeClick();
          // setTimeout(() => {
          //   console.log(JSON.stringify(values, null, 2));
          //   setSubmitting(false);
          // }, 500);
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
                  <SpotEditorButons
                    isSubmitting={isSubmitting}
                    handleEditModeClick={handleEditModeClick}
                  />
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
                        type={'text'}
                        label={'API Endpoints'}
                      />
                      <SpotEditorCheckbox
                        name={'cyanoPossible'}
                        type={'checkbox'}
                        label={'Cyanobakterien möglich'}
                        value={
                          values.cyanoPossible === undefined
                            ? true
                            : values.cyanoPossible
                        }
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
                        name={'healthDepartmentCity'}
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
                        value={
                          values.waterRescueThroughDLRGorASB === undefined
                            ? false
                            : values.waterRescueThroughDLRGorASB
                        }
                      />
                      <SpotEditorCheckbox
                        name={'lifeguard'}
                        type={'checkbox'}
                        label={'Rettungschwimmer vor Ort'}
                        value={
                          values.lifeguard === undefined
                            ? false
                            : values.lifeguard
                        }
                      />
                      <SpotEditorCheckbox
                        name={'disabilityAccess'}
                        type={'checkbox'}
                        label={'Barrierefreie'}
                        value={
                          values.disabilityAccess === undefined
                            ? false
                            : values.disabilityAccess
                        }
                      />
                      <SpotEditorCheckbox
                        name={'disabilityAccessBathrooms'}
                        type={'checkbox'}
                        label={'Barrierefreie Waschräume'}
                        value={
                          values.disabilityAccessBathrooms === undefined
                            ? false
                            : values.disabilityAccessBathrooms
                        }
                      />
                      <SpotEditorCheckbox
                        name={'hasDisabilityAccesableEntrence'}
                        type={'checkbox'}
                        label={'Barrierefreier Eingang'}
                        value={
                          values.hasDisabilityAccesableEntrence === undefined
                            ? false
                            : values.hasDisabilityAccesableEntrence
                        }
                      />
                      <SpotEditorCheckbox
                        name={'restaurant'}
                        type={'checkbox'}
                        label={'Restaurant'}
                        value={
                          values.restaurant === undefined
                            ? false
                            : values.restaurant
                        }
                      />
                      <SpotEditorCheckbox
                        name={'snack'}
                        type={'checkbox'}
                        label={'Snack'}
                        value={
                          values.snack === undefined ? false : values.snack
                        }
                      />
                      <SpotEditorCheckbox
                        name={'parkingSpots'}
                        type={'checkbox'}
                        label={'Parkplätze'}
                        value={
                          values.parkingSpots === undefined
                            ? false
                            : values.parkingSpots
                        }
                      />
                      <SpotEditorCheckbox
                        name={'bathrooms'}
                        type={'checkbox'}
                        label={'Waschräume'}
                        value={
                          values.bathrooms === undefined
                            ? false
                            : values.bathrooms
                        }
                      />

                      <SpotEditorCheckbox
                        name={'bathroomsMobile'}
                        type={'checkbox'}
                        label={'Mobile Toiletten'}
                        value={
                          values.bathroomsMobile === undefined
                            ? false
                            : values.bathroomsMobile
                        }
                      />
                      <SpotEditorCheckbox
                        name={'dogban'}
                        type={'checkbox'}
                        label={'Hundeverbot'}
                        value={
                          values.dogban === undefined ? false : values.dogban
                        }
                      />
                    </fieldset>
                  </div>
                  <div className='box'>
                    <fieldset>
                      <legend className='title is-5'>
                        Admin Bereich (noch nicht implementiert)
                      </legend>
                      {/* <SpotEditorInput
                        name={user.pgapiData.id}
                        type={'number'}
                        label={'Übertragung an andere Benutzer'}
                      /> */}
                    </fieldset>
                  </div>
                  <SpotEditorButons
                    isSubmitting={isSubmitting}
                    handleEditModeClick={handleEditModeClick}
                  />
                  {/* <div className='field is-grouped is-grouped-right'>
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
                  </div> */}
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
