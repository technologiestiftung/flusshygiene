import React, { useState } from 'react';
import { Container } from '../../Container';
import { Formik, Form } from 'formik';
import { FormikButtons } from '../formik-helpers/FormikButtons';
import { SpotEditorInput } from '../elements/SpotEditor-Input';
import {
  ClickFunction,
  IInitialGiPPValues,
  RequestResourceTypes,
} from '../../../lib/common/interfaces';
import { singlePPlantGiSchema } from '../../../lib/utils/spot-validation-schema';
import { actionCreator } from '../../../lib/utils/pgapi-actionCreator';
import { useAuth0 } from '../../../lib/auth/react-auth0-wrapper';
import { REACT_APP_API_HOST } from '../../../lib/config';
import { APIMountPoints, ApiResources } from '../../../lib/common/enums';
import { apiRequest, useApi } from '../../../contexts/postgres-api';
import { InfoAutoData } from '../elements/SpotEditor-Measurments-Info';

export const GIPPEditor: React.FC<{
  handleCancelClick: ClickFunction;
  intitalValues?: IInitialGiPPValues;
  reqType?: 'POST' | 'PUT';
  resourceType: RequestResourceTypes;
  userId: number;
  spotId: number;
  subItemId?: number;
  handleSubmitClose: ClickFunction;
}> = ({
  handleCancelClick,
  intitalValues,
  reqType,
  resourceType,
  spotId,
  userId,
  subItemId,
  handleSubmitClose,
}) => {
  if (reqType === undefined) {
    throw new Error('Request type needs to be POST or PUT');
  }
  if (subItemId === undefined && reqType === 'PUT') {
    throw new Error('subItemId needs to be defined');
  }
  const [, apiDispatch] = useApi();

  // const [reqType, setReqType] = useState<'POST' | 'PUT' | undefined>(undefined);
  //console.log(resourceType, 'in gi-pp-editor');

  const { getTokenSilently } = useAuth0();
  const [showInfo, setShowInfo] = useState(true);
  const BASE_URL = `${REACT_APP_API_HOST}/${APIMountPoints.v1}/${
    ApiResources.users
  }/${userId}/${ApiResources.bathingspots}/${spotId}/${
    resourceType === 'genericInputs' ? 'genericInputs' : 'purificationPlants'
  }`;
  //console.log(BASE_URL);

  const postData = async (name: string, url?: string) => {
    try {
      const token = await getTokenSilently();
      // console.log('POST');
      const action = actionCreator({
        url: BASE_URL,
        method: reqType,
        resource: resourceType,
        body: { url, name },
        token,
      });
      apiRequest(apiDispatch, action);
      handleSubmitClose();
      // console.log(action);
    } catch (error) {
      throw error;
    }
  };
  const putData = async (name: string, url?: string) => {
    try {
      const token = await getTokenSilently();
      // console.log('PUT');
      const action = actionCreator({
        url: `${BASE_URL}/${subItemId}`,
        method: reqType,
        resource:
          resourceType === 'gInputMeasurements'
            ? 'genericInputs'
            : 'purificationPlants',
        body: { url, name },
        token,
      });
      apiRequest(apiDispatch, action);
      handleSubmitClose();
      // console.log(action);
    } catch (error) {
      throw error;
    }
  };
  const initValues = intitalValues ? intitalValues : { url: '', name: '' };
  // useEffect(() => {
  //   setReqType(intitalValues ? 'POST' : 'PUT');
  // }, [setReqType, intitalValues]);

  return (
    <>
      <Container>
        <Formik
          initialValues={initValues}
          validationSchema={singlePPlantGiSchema}
          onSubmit={(values, bag) => {
            // console.log(values);
            // bag.setSubmitting(false);
            //
            bag.setSubmitting(false);
            if (reqType === 'POST') {
              postData(values.name, values.url)
                .then(() => {})
                .catch((err) => {
                  console.error(err);
                  // bag.setSubmitting(false);
                });
            }
            if (reqType === 'PUT') {
              putData(values.name, values.url)
                .then(() => {
                  // bag.setSubmitting(false);
                })
                .catch((err) => {
                  console.error(err);
                  // bag.setSubmitting(false);
                });
            }
          }}
        >
          {(props) => {
            return (
              <Form>
                <FormikButtons
                  props={props}
                  handleCancelClick={handleCancelClick}
                  infoModalClickHandler={() => {
                    setShowInfo((value) => !value);
                  }}
                ></FormikButtons>
                <SpotEditorInput label='Name' type='text' name='name' />
                <SpotEditorInput label='http(s) URL' type='text' name='url' />
              </Form>
            );
          }}
        </Formik>
      </Container>
      <Container>
        {/* <InfoDataAggregation /> */}
        {showInfo && <InfoAutoData></InfoAutoData>}
        {/* <SpotEditorMeasurmentInfo
          type={
            resourceType === 'genericInputs'
              ? 'gInputMeasurements'
              : 'pplantMeasurements'
          }
        /> */}
      </Container>
    </>
  );
};
