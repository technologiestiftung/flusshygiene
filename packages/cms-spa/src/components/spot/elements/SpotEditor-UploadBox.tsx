import React, { useState, createRef, useEffect } from 'react';
import { Field, ErrorMessage } from 'formik';
import { SpotEditorBox } from './SpotEditor-Box';
import { SpotEditorFile } from './SpotEditor-File';
import { ParseError } from 'papaparse';
import {
  ICSVValidationErrorRes,
  IMeasurementsUploadBox,
  IMeasurement,
} from '../../../lib/common/interfaces';
import { CSVvalidation } from '../formik-helpers/CSVvalidation';
import { CSVparsing } from '../formik-helpers/CSVparsing';
import { papaPromise } from '../../../lib/utils/papaPromise';
import { SpotEditorMeasurmentInfo } from './SpotEditor-Measurments-Info';
import { DataValidationInfoBox } from './DataValidationInfoBox';
import { validURL } from '../../../lib/utils/validURL';
import { unique } from '../../../lib/utils/unique-values';
import { CSVUnique } from '../formik-helpers/CSVunique';
import { InfoDataAggregation } from '../../infos/data-aggregation';

export const UploadBox: React.FC<IMeasurementsUploadBox> = ({
  title,
  schema,
  props,
  fieldNameFile,
  fieldNameUrl,
  type,
  unboxed,
  addionalClassNames,
  hasNoUrlField,
}) => {
  const { setFieldValue } = props;
  const [parsingErrors, setParsingErrors] = useState<
    Array<ParseError> | undefined
  >(undefined);
  const [csvValidationErrors, setCSVValidationErrors] = useState<
    ICSVValidationErrorRes[]
  >([]);
  const [uniqueDataError, setUniqueDataError] = useState<boolean | undefined>(
    undefined,
  );
  const [data, setData] = useState<IMeasurement[] | undefined>(undefined);
  const [dataUrl, setDataUrl] = useState<string | undefined>(undefined);
  // const [urlIsValid, setUrlIsValid] = useState<boolean | undefined>(undefined);
  const [csvFile, setCsvFile] = useState<File>();
  const [dataIsValid, setDataIsValid] = useState<boolean | undefined>(
    undefined,
  );
  let csvValidationRef = createRef<HTMLTableElement>();
  let papaParseValidationRef = createRef<HTMLTableElement>();

  const resetData = () => {
    setDataIsValid(undefined);
    setCsvFile(undefined);
    setData(undefined);
    setFieldValue(fieldNameFile, []);
    setCSVValidationErrors([]);
    setParsingErrors([]);
    setUniqueDataError(undefined);
  };
  const resetDataUrl = () => {
    setDataUrl(undefined);
    setFieldValue(fieldNameUrl, '');
  };

  /**
   * This effect sets the data for formik;
   */
  useEffect(() => {
    if (data === undefined) return;
    if (data.length <= 0) return;
    setFieldValue(fieldNameFile, data);
  }, [data, fieldNameFile, setFieldValue]);
  /**
   * This effect sets the data for formik;
   */
  useEffect(() => {
    if (dataUrl === undefined) return;
    if (validURL(dataUrl) === true) {
      setFieldValue(fieldNameUrl, dataUrl);
    }
  }, [dataUrl, fieldNameUrl, setFieldValue]);
  /**
   * This hook takes care of data validation
   */
  useEffect(() => {
    if (csvFile === undefined) return;
    const runValidation = async () => {
      try {
        const config: Papa.ParseConfig = {
          delimiter: '',
          dynamicTyping: true,
          header: true,
          skipEmptyLines: true,
        };
        const results = await papaPromise(csvFile, config);
        setParsingErrors(results.errors);
        let allValid = true;
        setDataIsValid(results.errors.length === 0 ? true : false);
        for (let i = 0; i < results.data.length; i++) {
          const elem = results.data[i];
          try {
            await schema.validate(elem);
          } catch (err) {
            allValid = false;
            const obj: ICSVValidationErrorRes = {
              row: i + 1,
              message: err.message,
            };
            setCSVValidationErrors((prevErrors) => {
              return [...prevErrors, obj];
            });
          }
          if (i === results.data.length - 1 && allValid === true) {
            setData(results.data);
            setDataIsValid(true);
            // console.log(results.data);
          }
        }
        setDataIsValid(allValid);
        const uniqueData = unique(results.data, 'date');
        // console.log(results.data);
        if (uniqueData.length < results.data.length) {
          setUniqueDataError(false);
          setDataIsValid(false);
        } else {
          setUniqueDataError(undefined);
          setDataIsValid(true);
        }
      } catch (error) {
        throw error;
      }
    };
    runValidation().catch((err) => {
      console.error(err);
    });
  }, [csvFile, schema]);

  const box = (
    <div className={`${addionalClassNames ? addionalClassNames : ''}`}>
      <SpotEditorMeasurmentInfo type={type} />
      <SpotEditorFile
        name={fieldNameFile}
        type={'file'}
        label={'Datei auswählen…'}
        disabled={false}
        handleClearClick={(e) => {
          e.preventDefault();
          resetData();
        }}
        onChange={(event: React.ChangeEvent<any>) => {
          setCSVValidationErrors([]);
          setParsingErrors([]);
          setUniqueDataError(undefined);
          if (
            event.currentTarget.files === null ||
            event.currentTarget.files.length < 1
          ) {
            return;
          }
          const file = event.currentTarget.files[0];
          // console.log('file', file);
          setCsvFile(file);
        }}
      ></SpotEditorFile>
      {csvValidationErrors.length > 0 &&
        CSVvalidation(csvValidationRef, csvValidationErrors)}
      {parsingErrors !== undefined &&
        parsingErrors.length > 0 &&
        CSVparsing(papaParseValidationRef, parsingErrors)}
      {(uniqueDataError !== undefined || uniqueDataError === true) && (
        <CSVUnique type={type} />
      )}
      {(() => {
        if (hasNoUrlField === true) {
          return null;
        } else {
          return (
            <>
              {<InfoDataAggregation />}
              {/* <div className='content' style={{ paddingTop: '1rem' }}>
                <p>
                  Automatisierte Datenaggregation <br />
                  Um Daten automatisiert für ihre Badestelle bereit zu stellen,
                  müssen sie eine öffentlich zugängliche http URL eintragen, die
                  täglich um 09:00 abgeholt werden kann.
                </p>
              </div> */}
              <div className='field is-horizontal'>
                <div className='field-label is-normal'>
                  <label htmlFor={fieldNameUrl} className='label'>
                    {'http(s) url:'}
                  </label>
                </div>
                <div className='field-body'>
                  <div className='field has-addons'>
                    <div className='control is-expanded'>
                      <Field
                        type={'input'}
                        name={fieldNameUrl}
                        className='input is-small'
                        id={fieldNameUrl}
                        data-testid={`test-input-${fieldNameUrl}`}
                        onChange={(event: React.ChangeEvent<any>) => {
                          // console.log(event.currentTarget);
                          setDataUrl(event.currentTarget.value);
                          props.setFieldValue(
                            fieldNameUrl,
                            event.currentTarget.value,
                          );
                        }}
                      />
                      <ErrorMessage
                        name={fieldNameUrl}
                        component='div'
                        className='help is-danger'
                      />
                    </div>
                    <div className='control'>
                      {/* <button
                        className='button is-small'
                        onClick={(e) => {
                          e.preventDefault();
                          alert('Noch nicht möglich');
                        }}
                      >
                        testen
                      </button> */}
                    </div>
                    <div className='control'>
                      <button
                        className='button is-small'
                        onClick={(e) => {
                          e.preventDefault();
                          resetDataUrl();
                        }}
                      >
                        URL entfernen
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        }
      })()}
    </div>
  );

  return (
    <>
      {dataIsValid !== undefined && (
        <DataValidationInfoBox
          title={title}
          dataIsValid={dataIsValid}
          unboxed={unboxed}
        />
      )}
      {(() => {
        if (unboxed === true) {
          return box;
        } else {
          return <SpotEditorBox title={title}>{box}</SpotEditorBox>;
        }
      })()}
    </>
  );
};
