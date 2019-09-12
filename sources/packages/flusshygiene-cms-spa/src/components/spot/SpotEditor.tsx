import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
// import SpotEditorInput from './SpotEditor-Input';
// import SpotEditorCheckbox from './SpotEditor-Checkbox';
import {
  IBathingspot,
  IFetchSpotOptions,
  MapEditModes,
  IGeoJsonGeometry,
  IBathingspotExtend,
  ICSVValidationErrorRes,
  IBathingspotMeasurement,
  // MapActiveEditor,
} from '../../lib/common/interfaces';
import {
  // editorSchema,
  measurementsSchema,
} from '../../lib/utils/spot-validation-schema';
import { nullValueTransform } from '../../lib/utils/spot-nullvalue-transformer';
import { SpotEditorButtons } from './SpotEditor-Buttons';
import { APIMountPoints, ApiResources } from '../../lib/common/enums';
import { useAuth0 } from '../../react-auth0-wrapper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../lib/state/reducers/root-reducer';
import { putSpot } from '../../lib/state/reducers/actions/fetch-post-spot';
// import { SpotEditorSelect } from './SpotEditor-Select';
import { SpotEditorBox } from './SpotEditor-Box';
import { formSectionBuilder } from './SpotEditor-form-section-builder';
import { patchValues } from './form-data/patch-values';
import { setupBasisData } from './form-data/basis-data';
import { influenceData } from './form-data/influence-data';
import { additionalData } from './form-data/additional-data';
import { healthDepartmentData } from './form-data/healtdepartment-data';
// import { useMapResizeEffect } from '../../hooks/map-hooks';
import FormikSpotEditorMap from './SpotEditor-Map';
// import { SpotEditorMapToolbar } from './SpotEditorMapToolbar';
import { REACT_APP_API_HOST } from '../../lib/config';
import { SpotEditorFile } from './SpotEditor-File';
import Papa, { ParseError } from 'papaparse';
import { IconSave, IconCloseWin, IconInfo } from '../fontawesome-icons';
import { SpotEditorInfoModal } from './SpotEditor-InfoModal';

export const SpotEditor: React.FC<{
  initialSpot: IBathingspotExtend;
  handleEditModeClick: () => void;
  newSpot?: boolean;
}> = ({ initialSpot, handleEditModeClick, newSpot }) => {
  // const mapToolbarClickHandler: React.MouseEventHandler<HTMLDivElement> = (
  //   event,
  // ) => {
  //   event.preventDefault();
  //   console.log(event.currentTarget.id);
  //   switch (event.currentTarget.id) {
  //     case 'info':
  //       // console.log('info');
  //       break;
  //     case 'area':
  //       // setSelectedIndex(1);
  //       // if (activeEditor === 'area') {
  //       //   // setAreaMode('view');
  //       //   setActiveEditor(undefined);
  //       // } else {
  //       //   // setAreaMode('modify');
  //       //   // setLocationMode('view');
  //       //   setActiveEditor('area');
  //       // }
  //       break;
  //     case 'location':
  //       // setSelectedIndex(0);
  //       // if (activeEditor === 'location') {
  //       //   // setLocationMode('view');
  //       //   setActiveEditor(undefined);
  //       // } else {
  //       //   // setLocationMode('modify');
  //       //   // setAreaMode('view');
  //       //   setActiveEditor('location');
  //       // }
  //       break;
  //   }
  //   // console.log(selectedIndex);
  // };
  // const mapToolbarEditModeHandler: React.MouseEventHandler<HTMLDivElement> = (
  //   event,
  // ) => {
  //   event.preventDefault();
  //   console.log(event.currentTarget.id);
  //   switch (event.currentTarget.id) {
  //     case 'view':
  //     case 'modify':
  //     case 'translate':
  //     case 'drawPoint':
  //     case 'drawPolygon':
  //       setEditMode(event.currentTarget.id);
  //       break;
  //   }
  // };

  // const mapRef = useRef<HTMLDivElement>(null);
  // const mapDims = useMapResizeEffect(mapRef);

  // ┌─┐┌┬┐┌─┐┌┬┐┌─┐
  // └─┐ │ ├─┤ │ ├┤
  // └─┘ ┴ ┴ ┴ ┴ └─┘
  const [csvFile, setCsvFile] = useState<File>();
  const [parsingErrors, setParsingErrors] = useState<Array<ParseError>>();
  const [csvValidationErrors, setCSVValidationErrors] = useState<
    ICSVValidationErrorRes[]
  >([]);
  const [measurments, setMeasurments] = useState<IBathingspotMeasurement[]>([]);
  const [allMeasurmentsValid, setAllMeasurmentsValid] = useState(false);
  const [modalIsActive, setModalIsActive] = useState(false);
  // const [selectedIndex, setSelectedIndex] = useState<number>(0);
  // const [areaMode /*, setAreaMode*/] = useState<MapEditModes>('view');
  // const [locationMode /*, setLocationMode*/] = useState<MapEditModes>('view');
  const [editMode /*setEditMode*/] = useState<MapEditModes>('view');
  // const [activeEditor, setActiveEditor] = useState<MapActiveEditor>(undefined);

  const { user } = useAuth0();
  const { getTokenSilently } = useAuth0();

  const transformedSpot = nullValueTransform(initialSpot);
  // console.log(transformedSpot);

  // ┬ ┬┌─┐┌┐┌┌┬┐┬  ┌─┐┬─┐┌─┐
  // ├─┤├─┤│││ │││  ├┤ ├┬┘└─┐
  // ┴ ┴┴ ┴┘└┘─┴┘┴─┘└─┘┴└─└─┘

  const infoModalClickHandler = () => {
    setModalIsActive((prevState) => {
      return !prevState;
    });
  };

  // ╦═╗┌─┐┌┬┐┬ ┬─┐ ┬
  // ╠╦╝├┤  │││ │┌┴┬┘
  // ╩╚═└─┘─┴┘└─┘┴ └─
  const postDone = useSelector((state: RootState) => state.postSpot.loading);
  const dispatch = useDispatch();

  // ╔═╗╔═╗╔═╗╔═╗╔═╗╔╦╗
  // ║╣ ╠╣ ╠╣ ║╣ ║   ║
  // ╚═╝╚  ╚  ╚═╝╚═╝ ╩
  useEffect(() => {
    if (csvFile === undefined) return;
    const config: Papa.ParseConfig = {
      dynamicTyping: true,
      header: true,
      error: (error, file?) => {
        console.error('Error in papaparse');
        console.error(file, error);
      },
      complete: (results, file?) => {
        // console.log('papaparse results');
        // console.log(file, results);
        setParsingErrors(results.errors);
        let allValid = true;
        for (let i = 0; i < results.data.length; i++) {
          const elem = results.data[i];
          measurementsSchema
            .isValid(elem)
            // eslint-disable-next-line
            .then((valid: boolean) => {
              // console.log(elem, ' is valid', valid);
              if (valid === false) {
                allValid = false;
                const obj: ICSVValidationErrorRes = {
                  row: i,
                  message:
                    'Daten entsprechen nicht dem Schema Date (YYYY-MM-DD), conc_ie (integer > 0), conc_ec (integer > 0)',
                };
                setCSVValidationErrors((prevErrors) => {
                  return [...prevErrors, obj];
                });
              }
              if (i === results.data.length - 1 && allValid === true) {
                setMeasurments(results.data as IBathingspotMeasurement[]);
                setAllMeasurmentsValid(true);
              } else {
              }
            })
            .catch(function(err) {
              console.error(err);
            });
        }
      },
    };
    Papa.parse(csvFile, config);
    // effect
    return () => {
      // cleanup
    };
  }, [csvFile]);

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

    let url: string;

    if (newSpot === true) {
      url = `${REACT_APP_API_HOST}/${APIMountPoints.v1}/${ApiResources.users}/${user.pgapiData.id}/${ApiResources.bathingspots}`;
    } else {
      url = `${REACT_APP_API_HOST}/${APIMountPoints.v1}/${ApiResources.users}/${user.pgapiData.id}/${ApiResources.bathingspots}/${spot.id}`;
    }
    const postSpotOpts: IFetchSpotOptions = {
      method: newSpot === true ? 'POST' : 'PUT',
      url,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      update: true,
      updateSingle: true,
      updateAll: true,
    };

    console.log('post options', postSpotOpts);

    dispatch(putSpot(postSpotOpts));
    if (
      newSpot === false ||
      (newSpot === undefined &&
        measurmentData !== undefined &&
        measurmentData.length > 0)
    ) {
      // console.log('posting measurements');
      const postMeasurmentsOpts: IFetchSpotOptions = {
        method: 'POST',
        url: `${REACT_APP_API_HOST}/${APIMountPoints.v1}/${ApiResources.users}/${user.pgapiData.id}/${ApiResources.bathingspots}/${spot.id}/${ApiResources.measurements}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(measurmentData),
        update: false,
      };
      dispatch(putSpot(postMeasurmentsOpts));
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={transformedSpot}
        // validationSchema={editorSchema}
        onSubmit={(values, { setSubmitting }) => {
          console.log('onSubmit');
          console.log(values);
          callPutPostSpot(values, measurments).catch((err) => {
            console.error(err);
          });
          setSubmitting(postDone);
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
          const patchedBasisData = patchValues(
            props.values,
            setupBasisData(
              props.handleChange,
              props.setFieldValue,
              props.values,
              editMode,
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
              <SpotEditorInfoModal
                isActive={modalIsActive}
                clickHandler={infoModalClickHandler}
              />
              <Form>
                <div className='buttons'>
                  <button
                    className='button is-primary is-small'
                    type='submit'
                    disabled={props.isSubmitting}
                    // onClick={(event: React.ChangeEvent<any>) => {
                    //   console.log('Hit submit', event);
                    //   handleSubmit(event);
                    // }}
                  >
                    <span>Speichern</span>{' '}
                    <span className='icon is-small'>
                      <IconSave />
                    </span>
                  </button>
                  <button
                    className='button is-light is-small'
                    type='button'
                    disabled={props.isSubmitting}
                    onClick={handleEditModeClick}
                    data-testid={'handle-edit-mode-button'}
                  >
                    <span>Abbrechen</span>{' '}
                    <span className='icon is-small'>
                      <IconCloseWin />
                    </span>
                  </button>
                  <button
                    className='button is-light is-small'
                    type='button'
                    onClick={infoModalClickHandler}
                    data-testid={'handle-info-mode-button'}
                  >
                    <span>Info</span>{' '}
                    <span className='icon is-small'>
                      <IconInfo />
                    </span>
                  </button>
                </div>
                {/* <SpotEditorButtons
                    isSubmitting={props.isSubmitting}
                    // handleSubmit={props.handleSubmit}
                    handleEditModeClick={handleEditModeClick}
                  /> */}
                {props.values !== undefined && (
                  <SpotEditorBox title={'Geo Daten *'}>
                    <FormikSpotEditorMap
                      width={800}
                      height={600}
                      data={[props.values]}
                      editMode={editMode}
                      // selectedIndex={selectedIndex}
                      // activeEditor={activeEditor}
                      handleUpdates={handleGeoJsonUpdates}
                      defaultFormikSetFieldValues={props.setFieldValue}
                    />
                    {/* </div> */}
                  </SpotEditorBox>
                )}
                <SpotEditorBox title={'Basis Daten'}>
                  {formSectionBuilder(patchedBasisData, props.handleChange)}
                </SpotEditorBox>
                <SpotEditorBox title={'Messwerte'}>
                  {newSpot === true && (
                    <div className='content'>
                      <p>
                        Bitte speichern Sie die Badestelle bevor Sie Daten
                        hochladen.
                      </p>
                    </div>
                  )}
                  {
                    <SpotEditorFile
                      name={'csvFile'}
                      type={'file'}
                      label={'Messwerte CSV'}
                      disabled={newSpot === true ? true : false}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>,
                      ) => {
                        setCSVValidationErrors([]);
                        setParsingErrors([]);
                        if (
                          event.currentTarget.files === null ||
                          event.currentTarget.files.length < 1
                        )
                          return;
                        const file = event.currentTarget.files[0];
                        // console.log('file', file);
                        props.setFieldValue('csvFile', file);
                        setCsvFile(file);

                        // let reader = new FileReader();
                        // reader.readAsText(file);
                        // reader.onerror = (event: ProgressEvent) => {
                        //   if (reader.error) {
                        //     console.error(reader.error);
                        //   }
                        // };
                        // reader.onload = (_event: ProgressEvent) => {
                        //   // if (event === null || event.target === null) return;
                        //   const csv = reader.result;
                        //   const validate = (csv) => csv;
                        //   console.log(validate(csv));
                        // };
                        // reader.onloadend = () => {
                        //   // console.log(reader.result);
                        //   console.log(
                        //     'props.values.file',
                        //     props.values.csvFile,
                        //   );
                        // };
                      }}
                    ></SpotEditorFile>
                  }
                  {allMeasurmentsValid === true && (
                    <div>
                      <div className='content'>
                        <p>Alle hochgeladenen Daten sind valide,</p>
                      </div>
                    </div>
                  )}
                  {csvValidationErrors.length > 0 && (
                    <div className=''>
                      <h3>CSV Daten Report</h3>
                      <table className='table'>
                        <thead>
                          <tr>
                            <th>{'Nummer'}</th>
                            <th>{'Zeile'}</th>
                            <th>{'Beschrebung'}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {csvValidationErrors.map((ele, i) => {
                            return (
                              <tr key={i}>
                                <td>{i}</td>
                                <td>{ele.row}</td>
                                <td>{ele.message}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {parsingErrors !== undefined && parsingErrors.length > 0 && (
                    <div className=''>
                      <h3>CSV Struktur Report</h3>
                      <table className='table'>
                        <thead>
                          <tr>
                            <th>{'Nummer'}</th>
                            <th>{'Zeile'}</th>
                            <th>{'Beschreibung'}</th>
                            <th>{'Fehler Code'}</th>
                            <th>{'Type'}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {parsingErrors.map((err, i) => {
                            return (
                              <tr key={i}>
                                <td>{i}</td>
                                <td>{err.row}</td>
                                <td>{err.message}</td>
                                <td>{err.code}</td>
                                <td>{err.type}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </SpotEditorBox>
                <SpotEditorBox title={'Bilder'}></SpotEditorBox>
                <SpotEditorBox title={'Hygienische Beeinträchtigung durch:'}>
                  {formSectionBuilder(patchedInfluenceData, props.handleChange)}
                </SpotEditorBox>
                <SpotEditorBox title={'Zuständiges Gesundheitsamt'}>
                  {formSectionBuilder(healthDepartmentData, props.handleChange)}
                </SpotEditorBox>

                <SpotEditorBox title={'Zusatz Daten'}>
                  {formSectionBuilder(
                    patchedAdditionalData,
                    props.handleChange,
                  )}
                </SpotEditorBox>
                {/* </fieldset>
                  </div> */}
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
