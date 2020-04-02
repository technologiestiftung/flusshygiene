import React, { useState } from 'react';
import {
  RequestResourceTypes,
  ClickFunction,
  IBathingspotApiEndpoints,
  ApiEndpointsLinkTypes,
} from '../../../lib/common/interfaces';
import { useApi, apiRequest } from '../../../contexts/postgres-api';
import { useAuth0 } from '../../../lib/auth/react-auth0-wrapper';
import { APIMountPoints, ApiResources } from '../../../lib/common/enums';
import { REACT_APP_API_HOST } from '../../../lib/config';
import { actionCreator } from '../../../lib/utils/pgapi-actionCreator';
import { Container } from '../../Container';
import { Formik, Form } from 'formik';
import { FormikButtons } from '../formik-helpers/FormikButtons';
import { SpotEditorInput } from '../elements/SpotEditor-Input';
import { InfoAutoData } from '../elements/SpotEditor-Measurments-Info';

/**
 * An Editor for global irradiances, discharges and measurements
 *
 */
export const MGDEditor: React.FC<{
  reqType: 'PUT';
  resourceType: RequestResourceTypes;
  linkType?: ApiEndpointsLinkTypes;
  userId: number;
  spotId: number;
  handleCancelClick: ClickFunction;
  handleSubmitClose: ClickFunction;
  initialValues?: IBathingspotApiEndpoints;
}> = ({
  userId,
  spotId,
  resourceType,
  linkType,
  initialValues,
  handleCancelClick,
  handleSubmitClose,
}) => {
  if (linkType === undefined) {
    throw new Error('linktype in MGDEditor is undefiend');
  }
  const [, apiDispatch] = useApi();
  const { getTokenSilently } = useAuth0();
  const [showInfo, setShowInfo] = useState(true);
  const BASE_URL = `${REACT_APP_API_HOST}/${APIMountPoints.v1}/${ApiResources.users}/${userId}/${ApiResources.bathingspots}/${spotId}`;

  initialValues = initialValues ? initialValues : {};
  const postData = async (url: string) => {
    // throw Error('hello boundary');
    let apiEndpoints = { ...initialValues };
    apiEndpoints[linkType] = url;

    try {
      const token = await getTokenSilently();
      const action = actionCreator({
        url: BASE_URL,
        method: 'PUT',
        resource: resourceType,
        body: { apiEndpoints },
        token,
      });

      apiRequest(apiDispatch, action);
      handleSubmitClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Container>
        <Formik
          initialValues={initialValues}
          onSubmit={(values, bag) => {
            bag.setSubmitting(false);
            //console.log(values);
            let url = values[linkType];

            if (url === undefined) {
              console.error('url not defiend in m-g-d-editor');
              return;
            } else {
              postData(url);
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
                <SpotEditorInput
                  label='http(s) URL'
                  type='text'
                  name={linkType}
                />
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
