import React, { useState, createRef, useEffect } from 'react';
// import { Field, ErrorMessage } from 'formik';
// import { SpotEditorBox } from './SpotEditor-Box';
import { SpotEditorFile } from './SpotEditor-File';
import { ParseError } from 'papaparse';
import {
  ICSVValidationErrorRes,
  IMeasurementsUploadBox,
  IMeasurement,
} from '../../../lib/common/interfaces';
import { NewCSVValidation } from '../formik-helpers/CSVvalidation';
import { NewCSVparsing } from '../formik-helpers/CSVparsing';
import { papaPromise } from '../../../lib/utils/papaPromise';
// import {
//   SpotEditorMeasurmentInfo,
//   InfoText,
// } from './SpotEditor-Measurments-Info';
import { DataValidationInfoBox } from './DataValidationInfoBox';
import { validURL } from '../../../lib/utils/validURL';
import { unique } from '../../../lib/utils/unique-values';
import { CSVUnique } from '../formik-helpers/CSVunique';
// import { InfoDataAggregation } from '../../infos/data-aggregation';
import { Container } from '../../Container';

export const NewUploadBox: React.FC<IMeasurementsUploadBox> = ({
  title,
  schema,
  props,
  fieldNameFile,
  fieldNameUrl,
  type,
  unboxed,
  addionalClassNames,
  hasNoUrlField,
  existingData,
}) => {
  const { setFieldValue } = props;
  const [parsingErrors, setParsingErrors] = useState<
    Array<ParseError> | undefined
  >(undefined);
  const [csvValidationErrors, setCSVValidationErrors] = useState<
    ICSVValidationErrorRes[] | undefined
  >(undefined);
  const [uniqueDataError, setUniqueDataError] = useState<boolean | undefined>(
    undefined,
  );
  const [data, setData] = useState<IMeasurement[] | undefined>(undefined);
  const [dataUrl] = useState<string | undefined>(undefined);
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
  // const resetDataUrl = () => {
  //   setDataUrl(undefined);
  //   setFieldValue(fieldNameUrl, '');
  // };

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
          trimHeaders: true,
          skipEmptyLines: true,
          transform: function(v): string {
            return v.trim();
          },
          transformHeader: function(h): string {
            return h.trim();
          },
        };
        const results = await papaPromise(csvFile, config);
        console.log(results, 'parsing result');
        setParsingErrors(results.errors);
        let allValid = true;
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
              const data = prevErrors ? prevErrors : [];
              return [...data, obj];
            });
          }
          if (i === results.data.length - 1 && allValid === true) {
            setData(results.data);
            setDataIsValid(true);
          }
        }

        // setDataIsValid(allValid);
        setDataIsValid(results.errors.length === 0 ? true : false);

        const uniqueData = unique(results.data, 'date');
        if (uniqueData.length < results.data.length) {
          setUniqueDataError(false);
          setDataIsValid(false);
        } else {
          setUniqueDataError(undefined);
          setDataIsValid(true);
          if (existingData !== undefined) {
            existingData.forEach((elem, i, arr) => {
              arr[i].date = elem.date
                .replace('T', ' ')
                .replace(/\.\d\d\dZ$/, '');
            });
            console.log(existingData, 'existingData');
            const combinedData = [...results.data, ...existingData];
            const uniqueCombined = unique(combinedData, 'date');
            if (uniqueCombined.length < combinedData.length) {
              console.log('not unique');
              setUniqueDataError(false);
              setDataIsValid(false);
            }
          }
        }
      } catch (error) {
        throw error;
      }
    };
    runValidation().catch((err) => {
      console.error(err);
    });
  }, [csvFile, schema, existingData]);

  return (
    <>
      {dataIsValid !== undefined && (
        <Container columnClassName=''>
          <DataValidationInfoBox
            title={''}
            dataIsValid={dataIsValid}
            unboxed={true}
          />
        </Container>
      )}
      <Container columnClassName=''>
        {/* <div className={`${addionalClassNames ? addionalClassNames : ''}`}> */}
        {/* <SpotEditorMeasurmentInfo type={type} /> */}
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
        {/* </div> */}
      </Container>
      <Container columnClassName=''>
        {csvValidationErrors !== undefined &&
          csvValidationErrors.length > 0 && (
            <NewCSVValidation
              csvValidationRef={csvValidationRef}
              csvValidationErrors={csvValidationErrors}
            />
          )}
        {parsingErrors !== undefined && parsingErrors.length > 0 && (
          <NewCSVparsing
            papaParseValidationRef={papaParseValidationRef}
            parsingErrors={parsingErrors}
          ></NewCSVparsing>
        )}
        {(uniqueDataError !== undefined || uniqueDataError === true) && (
          <CSVUnique type={type} />
        )}
      </Container>
    </>
  );
};
