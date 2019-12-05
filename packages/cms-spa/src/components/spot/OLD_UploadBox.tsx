import React, { useState, createRef, useEffect } from 'react';
import { Field, ErrorMessage } from 'formik';
import { SpotEditorBox } from './elements/SpotEditor-Box';

import { ParseError } from 'papaparse';
import {
  ICSVValidationErrorRes,
  IMeasurementsUploadBox,
  IMeasurement,
} from '../../lib/common/interfaces';
import { CSVvalidation } from './formik-helpers/CSVvalidation';
import { CSVparsing } from './formik-helpers/CSVparsing';
import { papaPromise } from '../../lib/utils/papaPromise';
import { DataValidationInfoBox } from './elements/DataValidationInfoBox';
import { validURL } from '../../lib/utils/validURL';
import { SpotEditorMeasurmentInfo } from './elements/SpotEditor-Measurments-Info';
import { SpotEditorFile } from './elements/SpotEditor-File';

export const UploadBox: React.FC<IMeasurementsUploadBox> = ({
  title,
  schema,
  props,
  fieldNameFile,
  fieldNameUrl,
}) => {
  const { setFieldValue } = props;
  const [parsingErrors, setParsingErrors] = useState<
    Array<ParseError> | undefined
  >(undefined);
  const [csvValidationErrors, setCSVValidationErrors] = useState<
    ICSVValidationErrorRes[]
  >([]);
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
   * TODO: Add duplicate detection
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
      } catch (error) {
        throw error;
      }
    };
    runValidation().catch((err) => {
      console.error(err);
    });
  }, [csvFile, schema]);
  return (
    <>
      {dataIsValid !== undefined && (
        <DataValidationInfoBox title={title} dataIsValid={dataIsValid} />
      )}
      <SpotEditorBox title={title}>
        <SpotEditorMeasurmentInfo type={'measurements'} />
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

        <div className='content' style={{ paddingTop: '1rem' }}>
          <p>
            Für automatisierte Datenaggregation <br />
            …Lorem ipsum dolor sit amet consectetur adipisicing elit. Temp is id
            tempore, suscipit dignissimos, ab placeat aperi sitatibus at minima
            impedit architecto iste nostrum animi voluptates minus!
          </p>
        </div>
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
                  className='input'
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
                <button
                  className='button'
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Noch nicht möglich');
                  }}
                >
                  testen
                </button>
              </div>
              <div className='control'>
                <button
                  className='button'
                  onClick={(e) => {
                    e.preventDefault();
                    resetDataUrl();
                  }}
                >
                  löschen
                </button>
              </div>
            </div>
          </div>
        </div>
      </SpotEditorBox>
    </>
  );
};
