import React from 'react';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { useApi } from '../../contexts/postgres-api';
import { FormikButtons } from './formik-helpers/FormikButtons';
import { UploadBox } from './UploadBox';
import { IMeasurmentsUploadInitialValues } from '../../lib/common/interfaces';
// import { measurementsSchema } from '../../lib/utils/spot-validation-schema';

/**
 * TODO: Add validation of duplicate values
 * TODO: Add response of upload to eventsource
 *
 */
export const SpotEditorMeasurmentsUpload: React.FC<{
  initialValues: IMeasurmentsUploadInitialValues;
  handeCloseClick: (e?: React.ChangeEvent<any> | undefined) => void;
  handleInfoClick: (e?: React.ChangeEvent<any> | undefined) => void;
  postData: (data: any) => void;
  schema: Yup.ObjectSchema<
    Yup.Shape<
      object,
      {
        date: Date;
        [key: string]: any;
      }
    >
  >;
}> = ({
  initialValues,
  handeCloseClick,
  handleInfoClick,
  postData,
  schema,
}) => {
  const [apiState] = useApi();

  return (
    <>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        onSubmit={(values, { setSubmitting }) => {
          // if (dataIsValid === true) {
          // postData(measurments);
          // }
          console.log('values in form', values);
          setSubmitting(apiState.loading);
          handeCloseClick();
        }}
      >
        {(props) => {
          return (
            <Form>
              {FormikButtons(props, handeCloseClick, handleInfoClick)}
              <UploadBox
                title={'Messwerte EC/IC'}
                props={props}
                schema={schema}
                fieldNameFile={'measurements'}
                fieldNameUrl={'measurementsUrl'}
              />
              <UploadBox
                title={'Messwerte Global Strahlung'}
                props={props}
                schema={schema}
                fieldNameFile={'globalIrradiance'}
                fieldNameUrl={'globalIrradianceUrl'}
              />
              <UploadBox
                title={'Messwerte Durchfluss'}
                props={props}
                schema={schema}
                fieldNameFile={'discharges'}
                fieldNameUrl={'dischargesUrl'}
              />
            </Form>
          );
        }}
      </Formik>
    </>
  );
};
