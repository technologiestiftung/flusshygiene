import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import {
  IBathingspot,
  MapEditModes,
  IGeoJsonGeometry,
  IBathingspotExtend,
  IBathingspotMeasurement,
  ApiActionTypes,
  IObject,
  // MapActiveEditor,
} from '../../lib/common/interfaces';
// import {
//   // editorSchema,
//   measurementsSchema,
// } from '../../lib/utils/spot-validation-schema';

import { nullValueTransform } from '../../lib/utils/spot-nullvalue-transformer';
import { SpotEditorButtons } from './SpotEditor-Buttons';
import { APIMountPoints, ApiResources } from '../../lib/common/enums';
import { useAuth0 } from '../../lib/auth/react-auth0-wrapper';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../../lib/state/reducers/root-reducer';
// import { putSpot } from '../../lib/state/reducers/actions/fetch-post-spot';
// import { SpotEditorSelect } from './SpotEditor-Select';
import { SpotEditorBox } from './SpotEditor-Box';
import { formSectionBuilder } from './SpotEditor-form-section-builder';
import { patchValues } from '../../lib/form-data/patch-values';
import { setupBasisData } from '../../lib/form-data/basis-data';
import { influenceData } from '../../lib/form-data/influence-data';
import { additionalData } from '../../lib/form-data/additional-data';
import { healthDepartmentData } from '../../lib/form-data/healtdepartment-data';
// import { useMapResizeEffect } from '../../hooks/map-hooks';
import FormikSpotEditorMap from './SpotEditor-Map';
// import { SpotEditorMapToolbar } from './SpotEditorMapToolbar';
import { REACT_APP_API_HOST } from '../../lib/config';
// import { SpotEditorFile } from './SpotEditor-File';
// import Papa, { ParseError } from 'papaparse';
// import { SpotEditorInfoModal } from './SpotEditor-InfoModal';
// import { SpotEditorMeasurmentInfo } from './SpotEditor-Measurments-Info';
import { useApi, apiRequest } from '../../contexts/postgres-api';
import { actionCreator } from '../../lib/utils/pgapi-actionCreator';
// import { papaPromise } from '../../lib/utils/papaPromise';
import { FormikButtons } from './formik-helpers/FormikButtons';
// import { CSVvalidation } from './formik-helpers/CSVvalidation';
// import { CSVparsing } from './formik-helpers/CSVparsing';

export const SpotEditor: React.FC<{
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
  // ╦═╗╔═╗╔═╗
  // ╠╦╝║╣ ╠╣
  // ╩╚═╚═╝╚
  // let csvValidationRef = createRef<HTMLTableElement>();
  // let papaParseValidationRef = createRef<HTMLTableElement>();

  // ┌─┐┌┬┐┌─┐┌┬┐┌─┐
  // └─┐ │ ├─┤ │ ├┤
  // └─┘ ┴ ┴ ┴ ┴ └─┘
  const [apiState, apiDispatch] = useApi();

  // const [csvFile, setCsvFile] = useState<File>();
  // const [parsingErrors, setParsingErrors] = useState<Array<ParseError>>();
  // const [csvValidationErrors, setCSVValidationErrors] = useState<
  //   ICSVValidationErrorRes[]
  // >([]);
  const [measurments /*setMeasurments*/] = useState<IBathingspotMeasurement[]>(
    [],
  );
  // const [allMeasurmentsValid, setAllMeasurmentsValid] = useState(false);
  // const [modalIsActive, setModalIsActive] = useState(false);
  // const [selectedIndex, setSelectedIndex] = useState<number>(0);
  // const [areaMode /*, setAreaMode*/] = useState<MapEditModes>('view');
  // const [locationMode /*, setLocationMode*/] = useState<MapEditModes>('view');
  const [editMode /*setEditMode*/] = useState<MapEditModes>('view');
  // const [activeEditor, setActiveEditor] = useState<MapActiveEditor>(undefined);

  const { user, getTokenSilently } = useAuth0();

  const transformedSpot = nullValueTransform(initialSpot);
  // console.log(transformedSpot);

  // ┬ ┬┌─┐┌┐┌┌┬┐┬  ┌─┐┬─┐┌─┐
  // ├─┤├─┤│││ │││  ├┤ ├┬┘└─┐
  // ┴ ┴┴ ┴┘└┘─┴┘┴─┘└─┘┴└─└─┘

  // const infoModalClickHandler = () => {
  //   setModalIsActive((prevState) => {
  //     return !prevState;
  //   });
  // };

  // ╦═╗┌─┐┌┬┐┬ ┬─┐ ┬
  // ╠╦╝├┤  │││ │┌┴┬┘
  // ╩╚═└─┘─┴┘└─┘┴ └─
  // const postDone = useSelector((state: RootState) => state.postSpot.loading);

  // ╔═╗╔═╗╔═╗╔═╗╔═╗╔╦╗
  // ║╣ ╠╣ ╠╣ ║╣ ║   ║
  // ╚═╝╚  ╚  ╚═╝╚═╝ ╩

  // useEffect(() => {
  //   if (csvFile === undefined) return;
  //   (async () => {
  //     try {
  //       const config: Papa.ParseConfig = {
  //         delimiter: '',
  //         dynamicTyping: true,
  //         header: true,
  //         skipEmptyLines: true,
  //       };
  //       const results = await papaPromise(csvFile, config);
  //       // console.log(results);
  //       setParsingErrors(results.errors);
  //       let allValid = true;
  //       setAllMeasurmentsValid(results.errors.length === 0 ? true : false);
  //       for (let i = 0; i < results.data.length; i++) {
  //         const elem = results.data[i];
  //         // console.log('element', elem);
  //         try {
  //           await measurementsSchema.validate(elem);
  //           // console.log('validateResult:', validateResult);
  //         } catch (err) {
  //           allValid = false;
  //           const obj: ICSVValidationErrorRes = {
  //             row: i + 1,
  //             message: err.message,
  //           };
  //           setCSVValidationErrors((prevErrors) => {
  //             return [...prevErrors, obj];
  //           });
  //           // console.error(err);
  //         }
  //         if (i === results.data.length - 1 && allValid === true) {
  //           setMeasurments(results.data as IBathingspotMeasurement[]);
  //           setAllMeasurmentsValid(true);
  //         }
  //       }
  //       setAllMeasurmentsValid(allValid);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   })();
  // }, [csvFile]);

  const callPutPostSpot = async (
    spot: IBathingspot,
    measurmentData?: IBathingspotMeasurement[],
  ) => {
    const token = await getTokenSilently();
    const { id, createdAt, version, updatedAt, ...body } = spot;
    // console.log(measurmentData);
    // console.log('unpatched body', body);
    for (const key in body) {
      // if (typeof body[key] === 'string') {
      //   if (body[key].length === 0) {
      //     delete body[key];
      //   }
      // }
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

    // console.log('patched body ', body);

    {
      let url: string;

      if (newSpot === true) {
        url = `${REACT_APP_API_HOST}/${APIMountPoints.v1}/${ApiResources.users}/${user.pgapiData.id}/${ApiResources.bathingspots}`;
      } else {
        url = `${REACT_APP_API_HOST}/${APIMountPoints.v1}/${ApiResources.users}/${user.pgapiData.id}/${ApiResources.bathingspots}/${spot.id}`;
      }
      // const postSpotOpts: IFetchSpotOptions = {
      //   method: newSpot === true ? 'POST' : 'PUT',
      //   url,
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify(body),
      //   update: true,
      //   updateSingle: true,
      //   updateAll: true,
      // };
      const action = actionCreator({
        method: newSpot === true ? 'POST' : 'PUT',
        type: ApiActionTypes.START_API_REQUEST,
        token,
        url,
        resource: 'bathingspot',
        body,
      });
      // console.log('post options', postSpotOpts);
      console.log('action ', action);
      apiRequest(apiDispatch, action);
    }
    // dispatch(putSpot(postSpotOpts));
    if (
      newSpot === false ||
      (newSpot === undefined &&
        measurmentData !== undefined &&
        measurmentData.length > 0)
    ) {
      // console.log('posting measurements');
      const url = `${REACT_APP_API_HOST}/${APIMountPoints.v1}/${ApiResources.users}/${user.pgapiData.id}/${ApiResources.bathingspots}/${spot.id}/${ApiResources.measurements}`;
      // const postMeasurmentsOpts: IFetchSpotOptions = {
      //   method: 'POST',
      //   url: `${REACT_APP_API_HOST}/${APIMountPoints.v1}/${ApiResources.users}/${user.pgapiData.id}/${ApiResources.bathingspots}/${spot.id}/${ApiResources.measurements}`,
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify(measurmentData),
      //   update: false,
      // };
      const action = actionCreator({
        method: 'POST',
        type: ApiActionTypes.START_API_REQUEST,
        token,
        url,
        resource: 'measurements',
        body: measurmentData as IObject,
      });
      apiRequest(apiDispatch, action);
      // dispatch(putSpot(postMeasurmentsOpts));
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={transformedSpot}
        // validationSchema={editorSchema}
        onSubmit={(values, { setSubmitting }) => {
          // console.log('onSubmit');
          // console.log(values);
          callPutPostSpot(values, measurments).catch((err) => {
            console.error(err);
          });
          setSubmitting(apiState.loading);
          handleEditModeClick();
        }}
      >
        {(props) => {
          // props.registerField('csvFile', {});
          props.registerField('location', {});
          props.registerField('area', {});

          const handleGeoJsonUpdates: (
            e: React.ChangeEvent<any>,
            location?: IGeoJsonGeometry,
            area?: IGeoJsonGeometry,
          ) => void = (e, location, area) => {
            console.log('handel geojson update');
            if (area !== undefined) {
              console.log('the area', area);
              props.setFieldValue('area', area);
            }
            if (location !== undefined) {
              // console.log('The location', location);
              props.setFieldValue('location', location);
              // props.setFieldValue('latitude', location.coordinates[1]);
              // props.setFieldValue('longitude', location.coordinates[0]);
            }
            props.handleChange(e);
          };
          // props.setFieldValue('latitude', location.coordinates[1])
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
            setupBasisData(
              props.values,
              // props.setFieldValue,
              // props.handleChange,
              // editMode,
              // activeEditor,
            ),
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
                {FormikButtons(
                  props,
                  handleEditModeClick,
                  handleInfoShowModeClick,
                )}
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
                <SpotEditorButtons
                  // handleSubmit={props.handleSubmit}
                  isSubmitting={props.isSubmitting}
                  handleEditModeClick={handleEditModeClick}
                />
              </Form>
            </>
          );
        }}
      </Formik>
    </>
  );
};
