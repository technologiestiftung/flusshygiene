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

export const SpotEditor: React.FC<{
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
          setSubmitting(postDone);
          handleEditModeClick();
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

          const patchedInfluenceData = patchValues(
            values,
            influenceData,
            'unknown',
          );

          const patchedBasisData = patchValues(values, basisData);

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
