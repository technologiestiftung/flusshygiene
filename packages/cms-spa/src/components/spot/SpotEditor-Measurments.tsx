import React from 'react';
import { Formik, Form } from 'formik';
import { useApi, apiRequest } from '../../contexts/postgres-api';
import { FormikButtons } from './formik-helpers/FormikButtons';
import { UploadBox } from './elements/SpotEditor-UploadBox';
import {
  IMeasurmentsUploadInitialValues,
  IApiAction,
  IBathingspotApiEndpoints,
} from '../../lib/common/interfaces';
import { useAuth0 } from '../../lib/auth/react-auth0-wrapper';
import {
  measurementsSchema,
  defaultMeasurementsSchema,
} from '../../lib/utils/spot-validation-schema';
import { REACT_APP_API_HOST } from '../../lib/config';
import { APIMountPoints, ApiResources } from '../../lib/common/enums';
import { actionCreator } from '../../lib/utils/pgapi-actionCreator';
import { validURL } from '../../lib/utils/validURL';

// import { measurementsSchema } from '../../lib/utils/spot-validation-schema';

/**
 * TODO: Add validation of duplicate values
 * TODO: Add response of upload to eventsource
 *
 */
export const SpotEditorMeasurmentsUpload: React.FC<{
  initialValues: IMeasurmentsUploadInitialValues;
  spotId: number;
  handeCloseClick: (e?: React.ChangeEvent<any> | undefined) => void;
  handleInfoClick: (e?: React.ChangeEvent<any> | undefined) => void;
  // postData: (data: any) => void;
  // schema: Yup.ObjectSchema<
  //   Yup.Shape<
  //     object,
  //     {
  //       date: Date;
  //       [key: string]: any;
  //     }
  //   >
  // >;
}> = ({ initialValues, handeCloseClick, handleInfoClick, spotId }) => {
  const [apiState, apiDispatch] = useApi();
  const { user, getTokenSilently } = useAuth0();
  // const [token, setToken] = useState<string | undefined>(undefined);
  const postData: (
    values: IMeasurmentsUploadInitialValues,
  ) => Promise<void> = async (values) => {
    try {
      const {
        measurements,
        measurementsUrl,
        globalIrradiance,
        globalIrradianceUrl,
        discharges,
        dischargesUrl,
      } = values;
      const token = await getTokenSilently();
      const baseUrl = `${REACT_APP_API_HOST}/${APIMountPoints.v1}/${ApiResources.users}/${user.pgapiData.id}/${ApiResources.bathingspots}/${spotId}`;
      const reqUrlGlobalIrradiance = `${baseUrl}/${ApiResources.globalIrradiances}`;
      const reqUrlDischarges = `${baseUrl}/${ApiResources.discharges}`;
      const reqUrlMeasurements = `${baseUrl}/${ApiResources.measurements}`;

      const actions: IApiAction[] = [];
      if (measurements.length > 0) {
        actions.push(
          actionCreator({
            body: measurements,
            token,
            url: reqUrlMeasurements,
            method: 'POST',
            resource: 'measurements',
          }),
        );
      }
      if (globalIrradiance.length > 0) {
        actions.push(
          actionCreator({
            body: globalIrradiance,
            token,
            url: reqUrlGlobalIrradiance,
            method: 'POST',
            resource: 'globalIrradiances',
          }),
        );
      }
      if (discharges.length > 0) {
        actions.push(
          actionCreator({
            body: discharges,
            token,
            url: reqUrlDischarges,
            method: 'POST',
            resource: 'discharges',
          }),
        );
      }
      let apiEndpoints: IBathingspotApiEndpoints = {};
      if (measurementsUrl !== undefined && validURL(measurementsUrl) === true) {
        apiEndpoints = { ...apiEndpoints, measurementsUrl };
      }
      if (
        globalIrradianceUrl !== undefined &&
        validURL(globalIrradianceUrl) === true
      ) {
        apiEndpoints = { ...apiEndpoints, globalIrradianceUrl };
      }
      if (dischargesUrl !== undefined && validURL(dischargesUrl) === true) {
        apiEndpoints = { ...apiEndpoints, dischargesUrl };
      }

      if (Object.keys(apiEndpoints).length > 0) {
        actions.push(
          actionCreator({
            body: { apiEndpoints },
            url: baseUrl,
            token,
            method: 'PUT',
            resource: 'bathingspot',
          }),
        );
      }
      // console.log(actions);
      // console.log('papiEndpoints', apiEndpoints);
      if (actions.length > 0) {
        actions.forEach((action) => {
          apiRequest(apiDispatch, action);
        });
      }
      // const {id} = spot;
    } catch (error) {
      throw error;
    }
  };
  return (
    <>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        onSubmit={(values, { setSubmitting }) => {
          // if (dataIsValid === true) {
          // postData(measurments);
          // }
          postData(values).catch((err) => {
            throw err;
          });
          // console.log('values in form', values);
          setSubmitting(apiState.loading);
          handeCloseClick();
        }}
      >
        {(props) => {
          return (
            <Form>
              <FormikButtons
                props={props}
                handleCancelClick={handeCloseClick}
                infoModalClickHandler={handleInfoClick}
              />
              <UploadBox
                fieldNameFile={'measurements'}
                fieldNameUrl={'measurementsUrl'}
                props={props}
                schema={measurementsSchema}
                title={'Messwerte EC/IC'}
                type={'measurements'}
              />
              <UploadBox
                fieldNameFile={'globalIrradiance'}
                fieldNameUrl={'globalIrradianceUrl'}
                props={props}
                schema={defaultMeasurementsSchema}
                title={'Messwerte Global Strahlung'}
                type={'globalIrradiances'}
              />
              <UploadBox
                fieldNameFile={'discharges'}
                fieldNameUrl={'dischargesUrl'}
                props={props}
                schema={defaultMeasurementsSchema}
                title={'Messwerte Durchfluss'}
                type={'discharges'}
              />
            </Form>
          );
        }}
      </Formik>
    </>
  );
};
