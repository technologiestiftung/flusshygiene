import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import {
  IBathingspot,
  MapEditModes,
  IBathingspotExtend,
  ApiActionTypes,
  IGeoJsonPoint,
  IGeoJsonPolygon,
} from '../../lib/common/interfaces';
import { nullValueTransform } from '../../lib/utils/spot-nullvalue-transformer';
import { APIMountPoints, ApiResources } from '../../lib/common/enums';
import { useAuth0 } from '../../lib/auth/react-auth0-wrapper';
import { SpotEditorBox } from './elements/SpotEditor-Box';
import { formSectionBuilder } from './elements/SpotEditor-form-section-builder';
import { patchValues } from '../../lib/form-data/patch-values';
import { setupBasisData } from '../../lib/form-data/basis-data';
import { influenceData } from '../../lib/form-data/influence-data';
import { additionalData } from '../../lib/form-data/additional-data';
import { healthDepartmentData } from '../../lib/form-data/healtdepartment-data';
import FormikSpotEditorMap from './elements/SpotEditor-Map';
import { REACT_APP_API_HOST } from '../../lib/config';
import { useApi, apiRequest } from '../../contexts/postgres-api';
import { actionCreator } from '../../lib/utils/pgapi-actionCreator';
import { FormikButtons } from './formik-helpers/FormikButtons';

export const SpotEditorBasisData: React.FC<{
  initialSpot: IBathingspotExtend;
  handleEditModeClick: (e?: React.ChangeEvent<any>) => void;
  handleInfoShowModeClick: (e?: React.ChangeEvent<any>) => void;
  newSpot?: boolean;
}> = ({
  initialSpot,
  handleEditModeClick,
  handleInfoShowModeClick,
  newSpot,
}) => {
  // ┌─┐┌┬┐┌─┐┌┬┐┌─┐
  // └─┐ │ ├─┤ │ ├┤
  // └─┘ ┴ ┴ ┴ ┴ └─┘
  const [apiState, apiDispatch] = useApi();

  const [editMode /*setEditMode*/] = useState<MapEditModes>('view');
  const { user, getTokenSilently } = useAuth0();

  const transformedSpot = nullValueTransform(initialSpot);
  // console.log(transformedSpot);

  const callPutPostSpot = async (spot: IBathingspot) => {
    const token = await getTokenSilently();
    const { id, createdAt, version, updatedAt, ...body } = spot;

    for (const key in body) {
      if (key === 'csvFile') {
        delete body[key];
      }
      if (key === 'isPublic') {
        continue;
      }
      if (key === 'location' || key === 'area') {
        continue;
      }
      if (body[key] === null || body[key] === undefined) {
        delete body[key];
      }
      if (body[key] === transformedSpot[key]) {
        delete body[key];
      }
    }

    // FIXME: Hotfix for location error
    if (body.location && body.location.type === 'Polygon') {
      body.location.type = 'Point';
    }
    if (body.location?.coordinates.length === 0) {
      delete body.location;
    }
    if (body.area?.coordinates.length === 0) {
      delete body.area;
    }
    {
      let url: string;

      if (newSpot === true) {
        url = `${REACT_APP_API_HOST}/${APIMountPoints.v1}/${ApiResources.users}/${user.pgapiData.id}/${ApiResources.bathingspots}`;
      } else {
        url = `${REACT_APP_API_HOST}/${APIMountPoints.v1}/${ApiResources.users}/${user.pgapiData.id}/${ApiResources.bathingspots}/${spot.id}`;
      }

      const action = actionCreator({
        method: newSpot === true ? 'POST' : 'PUT',
        type: ApiActionTypes.START_API_REQUEST,
        token,
        url,
        resource: newSpot === true ? 'bathingspots' : 'bathingspot',
        body,
      });
      // console.log('post options', postSpotOpts);
      // console.log('action ', action);
      apiRequest(apiDispatch, action);
    }
    // if (
    //   newSpot === false ||
    //   (newSpot === undefined &&
    //     measurmentData !== undefined &&
    //     measurmentData.length > 0)
    // ) {
    //   const url = `${REACT_APP_API_HOST}/${APIMountPoints.v1}/${ApiResources.users}/${user.pgapiData.id}/${ApiResources.bathingspots}/${spot.id}/${ApiResources.measurements}`;
    //   const action = actionCreator({
    //     method: 'POST',
    //     type: ApiActionTypes.START_API_REQUEST,
    //     token,
    //     url,
    //     resource: 'measurements',
    //     body: measurmentData as IObject,
    //   });
    //   apiRequest(apiDispatch, action);
    // }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={transformedSpot}
        onSubmit={(values, { setSubmitting }) => {
          // console.log(values, 'formik submit');

          callPutPostSpot(values).catch((err) => {
            console.error(err);
          });
          setSubmitting(apiState.loading);
          handleEditModeClick();
        }}
      >
        {(props) => {
          props.registerField('location', {});
          props.registerField('area', {});

          const handleGeoJsonUpdates: (
            e: React.ChangeEvent<any>,
            location?: IGeoJsonPoint,
            area?: IGeoJsonPolygon,
          ) => void = (e, location, area) => {
            // console.log('handel geojson update');
            if (area !== undefined) {
              // console.log('the area', area);
              props.setFieldValue('area', area);
            }
            if (location !== undefined) {
              props.setFieldValue('location', location);
            }
            props.handleChange(e);
          };
          const requiredData = patchValues(props.values, [
            {
              name: 'name',
              type: 'text',
              label: 'Name',
            },
            {
              name: 'cyanoPossible',
              type: 'checkbox',
              label: 'Cyanobakterien möglich',
              value: undefined,
            },
          ]);
          const patchedBasisData = patchValues(
            props.values,
            setupBasisData(props.values),
          );

          const patchedAdditionalData = patchValues(
            props.values,
            additionalData,
          );

          const patchedInfluenceData = patchValues(
            props.values,
            influenceData,
            'unknown',
          );

          return (
            <>
              <Form>
                <FormikButtons
                  props
                  handleCancelClick={handleEditModeClick}
                  infoModalClickHandler={handleInfoShowModeClick}
                />
                <SpotEditorBox title={'Basis Daten*'}>
                  {formSectionBuilder(requiredData, props.handleChange)}
                </SpotEditorBox>
                {props.values !== undefined && (
                  <SpotEditorBox title={'Geo Daten *'}>
                    <FormikSpotEditorMap
                      width={800}
                      height={600}
                      data={[props.values]}
                      editMode={editMode}
                      newSpot={newSpot}
                      handleUpdates={handleGeoJsonUpdates}
                      defaultFormikSetFieldValues={props.setFieldValue}
                    />
                  </SpotEditorBox>
                )}

                {newSpot === false ||
                  (newSpot === undefined && (
                    <>
                      <SpotEditorBox
                        title={'Hygienische Beeinträchtigung durch:'}
                      >
                        {formSectionBuilder(
                          patchedInfluenceData,
                          props.handleChange,
                        )}
                      </SpotEditorBox>
                      <SpotEditorBox title={'Zusatz Daten'}>
                        {formSectionBuilder(
                          [...patchedBasisData, ...patchedAdditionalData],
                          props.handleChange,
                        )}
                      </SpotEditorBox>

                      <SpotEditorBox title={'Zuständiges Gesundheitsamt'}>
                        {formSectionBuilder(
                          healthDepartmentData,
                          props.handleChange,
                        )}
                      </SpotEditorBox>
                    </>
                  ))}
                {/* <SpotEditorButtons
                  // handleSubmit={props.handleSubmit}
                  isSubmitting={props.isSubmitting}
                  handleEditModeClick={handleEditModeClick}
                /> */}
              </Form>
            </>
          );
        }}
      </Formik>
    </>
  );
};
