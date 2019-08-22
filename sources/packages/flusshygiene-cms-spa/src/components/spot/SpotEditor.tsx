import React from 'react';
import { Formik, Form } from 'formik';
// import SpotEditorInput from './SpotEditor-Input';
// import SpotEditorCheckbox from './SpotEditor-Checkbox';
import { IBathingspot, IFetchSpotOptions } from '../../lib/common/interfaces';
import { editorSchema } from '../../lib/utils/spot-validation-schema';
import { nullValueTransform } from '../../lib/utils/spot-nullvalue-transformer';
import { SpotEditorButtons } from './SpotEditor-Buttons';
import { API_DOMAIN } from '../../lib/common/constants';
import { APIMountPoints, ApiResources } from '../../lib/common/enums';
import { useAuth0 } from '../../react-auth0-wrapper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../lib/state/reducers/root-reducer';
import { putSpot } from '../../lib/state/reducers/actions/fetch-post-spot';
// import { SpotEditorSelect } from './SpotEditor-Select';
import { SpotEditorBox } from './SpotEditor-Box';
import { formSectionBuilder } from './SpotEditor-form-section-builder';
import { patchValues } from './form-data/patch-values';
import { basisData } from './form-data/basis-data';
import { influenceData } from './form-data/influence-data';
import { additionalData } from './form-data/additional-data';
import { healthDepartmentData } from './form-data/healtdepartment-data';
// const optionsYNU: IFormOptions[] = [
//   { text: 'Ja', value: 'yes' },
//   { text: 'Unbekannt', value: 'unknown' },
//   { text: 'Nein', value: 'no' },
// ];

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
          console.log(values);
          callPutSpot(values).catch((err) => {
            console.error(err);
          });
          // console.log(postDone);
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
          const patchedAdditionalData = patchValues(values, additionalData);
          // const oldadditionalData: IFormBuildData[] = [
          //   { name: 'waterRescue', type: 'text', label: 'Wasserrettung' },
          //   {
          //     name: 'waterRescueThroughDLRGorASB',
          //     type: 'checkbox',
          //     label: 'Wasserrettung durch DLRG oder ASB?',
          //     value:
          //       values.waterRescueThroughDLRGorASB === undefined
          //         ? false
          //         : values.waterRescueThroughDLRGorASB,
          //   },
          //   {
          //     name: 'lifeguard',
          //     type: 'checkbox',
          //     label: 'Rettungschwimmer vor Ort',
          //     value: values.lifeguard === undefined ? false : values.lifeguard,
          //   },
          //   {
          //     name: 'disabilityAccess',
          //     type: 'checkbox',
          //     label: 'Barrierefreie',
          //     value:
          //       values.disabilityAccess === undefined
          //         ? false
          //         : values.disabilityAccess,
          //   },
          //   {
          //     name: 'disabilityAccessBathrooms',
          //     type: 'checkbox',
          //     label: 'Barrierefreie Waschräume',
          //     value:
          //       values.disabilityAccessBathrooms === undefined
          //         ? false
          //         : values.disabilityAccessBathrooms,
          //   },
          //   {
          //     name: 'hasDisabilityAccesableEntrence',
          //     type: 'checkbox',
          //     label: 'Barrierefreier Eingang',
          //     value:
          //       values.hasDisabilityAccesableEntrence === undefined
          //         ? false
          //         : values.hasDisabilityAccesableEntrence,
          //   },
          //   {
          //     name: 'restaurant',
          //     type: 'checkbox',
          //     label: 'Restaurant',
          //     value:
          //       values.restaurant === undefined ? false : values.restaurant,
          //   },
          //   {
          //     name: 'snack',
          //     type: 'checkbox',
          //     label: 'Snack',
          //     value: values.snack === undefined ? false : values.snack,
          //   },
          //   {
          //     name: 'parkingSpots',
          //     type: 'checkbox',
          //     label: 'Parkplätze',
          //     value:
          //       values.parkingSpots === undefined ? false : values.parkingSpots,
          //   },
          //   {
          //     name: 'bathrooms',
          //     type: 'checkbox',
          //     label: 'Waschräume',
          //     value: values.bathrooms === undefined ? false : values.bathrooms,
          //   },

          //   {
          //     name: 'bathroomsMobile',
          //     type: 'checkbox',
          //     label: 'Mobile Toiletten',
          //     value:
          //       values.bathroomsMobile === undefined
          //         ? false
          //         : values.bathroomsMobile,
          //   },
          //   {
          //     name: 'dogban',
          //     type: 'checkbox',
          //     label: 'Hundeverbot',
          //     value: values.dogban === undefined ? false : values.dogban,
          //   },
          // ];
          const patchedInfluenceData = patchValues(
            values,
            influenceData,
            'unknown',
          );
          // const oldInfluenceData: IFormBuildData[] = [
          //   {
          //     type: 'select',
          //     name: 'influencePurificationPlant',
          //     label: 'kommunale Klärwerke',
          //     value:
          //       values.influencePurificationPlant === undefined
          //         ? 'unknown'
          //         : values.influencePurificationPlant,
          //     options: optionsYNU,
          //   },
          //   {
          //     type: 'select',
          //     name: 'influenceCombinedSewerSystem',
          //     label: 'Mischwassereinleitungen aus urbanen Gebieten',
          //     value:
          //       values.influenceCombinedSewerSystem === undefined
          //         ? 'unknown'
          //         : values.influenceCombinedSewerSystem,

          //     options: optionsYNU,
          //   },
          //   {
          //     type: 'select',

          //     name: 'influenceRainwater',
          //     label: 'Regenwassereileitung aus urbanen Gebieten',
          //     value:
          //       values.influenceRainwater === undefined
          //         ? 'unknown'
          //         : values.influenceRainwater,

          //     options: optionsYNU,
          //   },
          //   {
          //     type: 'select',
          //     name: 'influenceAgriculture',
          //     label: 'Einleitungen aus der Landwirtschaft',
          //     value:
          //       values.influenceAgriculture === undefined
          //         ? 'unknown'
          //         : values.influenceAgriculture,
          //     options: optionsYNU,
          //   },
          // ];

          // const healthDepartmentData: IFormBuildData[] = [
          //   {
          //     name: 'healthDepartment',
          //     type: 'text',
          //     label: 'Name',
          //   },
          //   {
          //     name: 'healthDepartmentAddition',
          //     type: 'text',
          //     label: 'Zusatz',
          //   },
          //   {
          //     name: 'healthDepartmentStreet',
          //     type: 'text',
          //     label: 'Straße',
          //   },
          //   {
          //     name: 'healthDepartmentPostalCode',
          //     type: 'number',
          //     label: 'Postleitzahl',
          //   },
          //   {
          //     name: 'healthDepartmentCity',
          //     type: 'text',
          //     label: 'Stadt',
          //   },
          //   {
          //     name: 'healthDepartmentMail',
          //     type: 'email',
          //     label: 'E-Mail',
          //   },
          //   {
          //     name: 'healthDepartmentPhone',
          //     type: 'email',
          //     label: 'Telefonnummer',
          //   },
          // ];

          const patchedBasisData = patchValues(values, basisData);
          // const oldbasisData: IFormBuildData[] = [
          //   { name: 'name', type: 'text', label: 'Name' },
          //   { name: 'nameLong', type: 'text', label: 'Langer Name' },
          //   {
          //     name: 'water',
          //     type: 'text',
          //     label: 'Gewässer',
          //   },
          //   { name: 'district', type: 'text', label: 'Distrikt' },
          //   { name: 'street', type: 'text', label: 'Straße' },
          //   { name: 'postalCode', type: 'number', label: 'Postleitzahl' },
          //   { name: 'city', type: 'text', label: 'Stadt' },
          //   { name: 'website', type: 'text', label: 'Website URL' },
          //   {
          //     name: 'lastClassification',
          //     type: 'text',
          //     label: 'Letzte Klassifizierung',
          //   },
          //   { name: 'image', type: 'text', label: 'Bild URL' },
          //   {
          //     name: 'latitude',
          //     type: 'number',
          //     label: 'Latitude',
          //   },
          //   { name: 'longitude', type: 'number', label: 'Longitude' },
          //   { name: 'elevation', type: 'number', label: 'Höhe über NN' },
          //   { name: 'apiEndpoints', type: 'text', label: 'API Endpoints' },
          //   {
          //     name: 'cyanoPossible',
          //     type: 'checkbox',
          //     label: 'Cyanobakterien möglich',
          //     value:
          //       values.cyanoPossible === undefined
          //         ? true
          //         : values.cyanoPossible,
          //   },
          // ];
          return (
            <div className='modal is-active'>
              <div className='modal-background'></div>
              <div className='modal-content'>
                <Form style={{ paddingTop: '10px' }}>
                  <SpotEditorButtons
                    isSubmitting={isSubmitting}
                    handleEditModeClick={handleEditModeClick}
                  />
                  <SpotEditorBox title={'Basis Daten'}>
                    {formSectionBuilder(patchedBasisData)}
                  </SpotEditorBox>
                  <SpotEditorBox title={'Hygienische Beeinträchtigung durch:'}>
                    {formSectionBuilder(patchedInfluenceData)}
                  </SpotEditorBox>

                  <SpotEditorBox title={'Zuständiges Gesundheitsamt'}>
                    {formSectionBuilder(healthDepartmentData)}
                  </SpotEditorBox>

                  <SpotEditorBox title={'Zusatz Daten'}>
                    {formSectionBuilder(patchedAdditionalData)}
                  </SpotEditorBox>
                  {/* </fieldset>
                  </div> */}
                  <SpotEditorButtons
                    isSubmitting={isSubmitting}
                    handleEditModeClick={handleEditModeClick}
                  />
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
