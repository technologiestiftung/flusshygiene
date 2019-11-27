import React, { useState, useEffect, createRef } from 'react';
import { Formik, Form } from 'formik';
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
import { useAuth0 } from '../../lib/auth/react-auth0-wrapper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../lib/state/reducers/root-reducer';
import { putSpot } from '../../lib/state/reducers/actions/fetch-post-spot';
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
import { SpotEditorFile } from './SpotEditor-File';
import Papa, { ParseError } from 'papaparse';
import { IconSave, IconCloseWin, IconInfo } from '../fontawesome-icons';
import { SpotEditorInfoModal } from './SpotEditor-InfoModal';
import { SpotEditorMeasurmentInfo } from './SpotEditor-Measurments-Info';
import { SpotEditorToClipboard } from './SpotEditor-ToClipboard';

export const SpotEditor: React.FC<{
  initialSpot: IBathingspotExtend;
  handleEditModeClick: () => void;
  newSpot?: boolean;
}> = ({ initialSpot, handleEditModeClick, newSpot }) => {
  // ╦═╗╔═╗╔═╗
  // ╠╦╝║╣ ╠╣
  // ╩╚═╚═╝╚
  let csvValidationRef = createRef<HTMLTableElement>();
  let papaParseValidationRef = createRef<HTMLTableElement>();

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

  const papaPromise: (file: any, opts: any) => Promise<Papa.ParseResult> = (
    file,
    opts,
  ) => {
    return new Promise((complete, error) => {
      Papa.parse(file, { ...opts, complete, error });
    });
  };
  // ╔═╗╔═╗╔═╗╔═╗╔═╗╔╦╗
  // ║╣ ╠╣ ╠╣ ║╣ ║   ║
  // ╚═╝╚  ╚  ╚═╝╚═╝ ╩

  useEffect(() => {
    if (csvFile === undefined) return;
    (async () => {
      try {
        const config: Papa.ParseConfig = {
          delimiter: '',
          dynamicTyping: true,
          header: true,
          skipEmptyLines: true,
        };
        const results = await papaPromise(csvFile, config);
        // console.log(results);
        setParsingErrors(results.errors);
        let allValid = true;
        setAllMeasurmentsValid(results.errors.length === 0 ? true : false);
        for (let i = 0; i < results.data.length; i++) {
          const elem = results.data[i];
          // console.log('element', elem);
          try {
            await measurementsSchema.validate(elem);
            // console.log('validateResult:', validateResult);
          } catch (err) {
            allValid = false;
            const obj: ICSVValidationErrorRes = {
              row: i + 1,
              message: err.message,
            };
            setCSVValidationErrors((prevErrors) => {
              return [...prevErrors, obj];
            });
            // console.error(err);
          }
          if (i === results.data.length - 1 && allValid === true) {
            setMeasurments(results.data as IBathingspotMeasurement[]);
            setAllMeasurmentsValid(true);
          }
        }
        setAllMeasurmentsValid(allValid);
      } catch (error) {
        console.error(error);
      }
    })();
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

    // console.log('post options', postSpotOpts);

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
          // console.log('onSubmit');
          // console.log(values);
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
                      // selectedIndex={selectedIndex}
                      // activeEditor={activeEditor}
                      handleUpdates={handleGeoJsonUpdates}
                      defaultFormikSetFieldValues={props.setFieldValue}
                    />
                    {/* </div> */}
                  </SpotEditorBox>
                )}
                <SpotEditorBox title={'Messwerte'}>
                  {newSpot === true && (
                    <div className='content'>
                      <p>
                        <strong>
                          Bitte speichern Sie die Badestelle bevor Sie Daten
                          hochladen.
                        </strong>
                      </p>
                    </div>
                  )}
                  <SpotEditorMeasurmentInfo />
                  {
                    <SpotEditorFile
                      name={'csvFile'}
                      type={'file'}
                      label={'Datei auswählen…'}
                      disabled={newSpot === true ? true : false}
                      /**
                       * @todo fix this aweful any
                       * Should be a React.ChangeEvent
                       * https://stackoverflow.com/questions/43176560/property-files-does-not-exist-on-type-eventtarget-error-in-typescript
                       * https://github.com/microsoft/TypeScript/issues/31816
                       */
                      onChange={(
                        event: any /*React.ChangeEvent<HTMLInputElement>*/,
                      ) => {
                        setCSVValidationErrors([]);
                        setParsingErrors([]);
                        if (
                          event.currentTarget.files === null ||
                          event.currentTarget.files.length < 1
                        ) {
                          return;
                        }
                        const file = event.currentTarget.files[0];
                        // console.log('file', file);
                        props.setFieldValue('csvFile', file);
                        setCsvFile(file);
                      }}
                    ></SpotEditorFile>
                  }
                  {allMeasurmentsValid === true && (
                    <div>
                      <div className='content'>
                        <p>
                          <strong>
                            Alle hochgeladenen Daten sind valide und bereit zum
                            speichern.
                          </strong>
                        </p>
                      </div>
                    </div>
                  )}
                  {csvValidationErrors.length > 0 && (
                    <>
                      <h3>CSV Daten Report</h3>
                      <SpotEditorToClipboard
                        buttonId={'csv-data-clip'}
                        csvValidationRef={csvValidationRef}
                      />
                      <table className='table' ref={csvValidationRef}>
                        <thead>
                          <tr>
                            <th>{'Fehler Nummer'}</th>
                            <th>{'In Zeile'}</th>
                            <th>{'Beschreibung'}</th>
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
                    </>
                  )}
                  {parsingErrors !== undefined && parsingErrors.length > 0 && (
                    <div className=''>
                      <h3>CSV Struktur Report</h3>
                      <SpotEditorToClipboard
                        buttonId={'csv-structure-clip'}
                        csvValidationRef={papaParseValidationRef}
                      />
                      <table className='table' ref={papaParseValidationRef}>
                        <thead>
                          <tr>
                            <th>{'Fehler Nummer'}</th>
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
                                <td>{err.row + 1}</td>
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
                <SpotEditorBox title={'Hygienische Beeinträchtigung durch:'}>
                  {formSectionBuilder(patchedInfluenceData, props.handleChange)}
                </SpotEditorBox>
                <SpotEditorBox title={'Zusatz Daten'}>
                  {formSectionBuilder(
                    [...patchedBasisData, ...patchedAdditionalData],
                    props.handleChange,
                  )}
                </SpotEditorBox>
                {/* <SpotEditorBox title={'Bilder'}></SpotEditorBox> */}

                <SpotEditorBox title={'Zuständiges Gesundheitsamt'}>
                  {formSectionBuilder(healthDepartmentData, props.handleChange)}
                </SpotEditorBox>

                {/* <SpotEditorBox title={'Zusatz Daten'}>
                  {formSectionBuilder(
                    patchedAdditionalData,
                    props.handleChange,
                  )}
                </SpotEditorBox> */}
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
