import React, { useState } from 'react';
import { Container } from '../../Container';
import { actionCreator } from '../../../lib/utils/pgapi-actionCreator';
import { useAuth0 } from '../../../lib/auth/react-auth0-wrapper';
import { apiRequest, useApi } from '../../../contexts/postgres-api';
import { REACT_APP_API_HOST } from '../../../lib/config';
import { APIMountPoints, ApiResources } from '../../../lib/common/enums';
import {
  RequestResourceTypes,
  ClickFunction,
} from '../../../lib/common/interfaces';
import { Formik, Form } from 'formik';
import { FormikButtons } from '../formik-helpers/FormikButtons';
import { defaultMeasurementsSchema } from '../../../lib/utils/spot-validation-schema';
import { NewUploadBox } from '../elements/New-UploadBox';
import { InfoText } from '../elements/SpotEditor-Measurments-Info';

export const GiPPUploader: React.FC<{
  userId: number;
  spotId: number;
  subItemId?: number;
  resourceType: RequestResourceTypes;
  handleCancelClick: ClickFunction;
}> = ({ userId, spotId, subItemId, resourceType, handleCancelClick }) => {
  if (subItemId === undefined) {
    throw new Error('subItemId needs to be defined');
  }
  const BASE_URL = `${REACT_APP_API_HOST}/${APIMountPoints.v1}/${
    ApiResources.users
  }/${userId}/${ApiResources.bathingspots}/${spotId}/${
    resourceType === 'gInputMeasurements'
      ? 'genericInputs'
      : 'purificationPlants'
  }/${subItemId}/${ApiResources.measurements}`;

  const [, apiDispatch] = useApi();

  // const [reqType, setReqType] = useState<'POST' | 'PUT' | undefined>(undefined);
  const { getTokenSilently } = useAuth0();

  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <Container>
        <Formik
          initialValues={{
            measurements: [],
          }}
          onSubmit={(values, bag) => {
            console.log(values);
            bag.setSubmitting(false);
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

                {showInfo ? (
                  <InfoText
                    type={'gInputMeasurements'}
                    showDataAggregationText={false}
                  ></InfoText>
                ) : (
                  <h3 className='is-title is-3'>CSV Daten Upload</h3>
                )}
                <NewUploadBox
                  unboxed={true}
                  type={
                    resourceType === 'gInputMeasurements'
                      ? 'gInputMeasurements'
                      : 'pplantMeasurements'
                  }
                  title={'set me'}
                  fieldNameFile={'measurements'}
                  fieldNameUrl={'url'}
                  props={props}
                  schema={defaultMeasurementsSchema}
                ></NewUploadBox>
              </Form>
            );
          }}
        </Formik>
      </Container>
    </>
  );
};
