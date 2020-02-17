import React, { useState, useEffect } from 'react';
import { Container } from '../../Container';
import { actionCreator } from '../../../lib/utils/pgapi-actionCreator';
import { useAuth0 } from '../../../lib/auth/react-auth0-wrapper';
import { apiRequest, useApi } from '../../../contexts/postgres-api';
import { REACT_APP_API_HOST } from '../../../lib/config';
import { APIMountPoints, ApiResources } from '../../../lib/common/enums';
import {
  RequestResourceTypes,
  ClickFunction,
  IGenericInput,
} from '../../../lib/common/interfaces';
import { Formik, Form } from 'formik';
import { FormikButtons } from '../formik-helpers/FormikButtons';
import { defaultMeasurementsSchema } from '../../../lib/utils/spot-validation-schema';
import { NewUploadBox } from '../elements/New-UploadBox';
import { InfoText } from '../elements/SpotEditor-Measurments-Info';
interface ISimpleMeasurement {
  date: string;
  value: number;
}

/**
 * Uploader FC
 */
export const GiPPUploader: React.FC<{
  userId: number;
  spotId: number;
  subItemId?: number;
  resourceType: RequestResourceTypes;
  handleCancelClick: ClickFunction;
  handleSubmitClose: ClickFunction;
}> = ({
  userId,
  spotId,
  subItemId,
  resourceType,
  handleCancelClick,
  handleSubmitClose,
}) => {
  if (subItemId === undefined) {
    throw new Error('subItemId needs to be defined');
  }
  const BASE_URL = `${REACT_APP_API_HOST}/${APIMountPoints.v1}/${ApiResources.users}/${userId}/${ApiResources.bathingspots}/${spotId}`;

  const title =
    resourceType === 'gInputMeasurements'
      ? 'Genrische Messungen'
      : 'Klärwerk Messungen';
  const POST_URL = `${BASE_URL}/${
    resourceType === 'gInputMeasurements'
      ? 'genericInputs'
      : 'purificationPlants'
  }/${subItemId}/${ApiResources.measurements}`;
  /**
   *
   * State
   *
   *
   */

  const [apiState, apiDispatch] = useApi();
  const [existingData, setExistingData] = useState<any[]>([]);

  const [showInfo, setShowInfo] = useState(true);

  /**
   *
   * Hooks
   *
   */
  const { getTokenSilently } = useAuth0();

  /**
   *
   * effects
   *
   */
  useEffect(() => {
    const filteredSpots = apiState.spots.filter((spot) => spot.id === spotId);
    if (filteredSpots.length === 0) return;
    const spot = filteredSpots[0];
    let entities: IGenericInput[] | undefined;
    switch (resourceType) {
      case 'gInputMeasurements': {
        entities = spot.genericInputs?.filter((item) => item.id === subItemId);
        if (entities === undefined || entities.length === 0) return;
        break;
      }
      case 'pplantMeasurements': {
        entities = spot.purificationPlants?.filter(
          (item) => item.id === subItemId,
        );
        if (entities === undefined || entities.length === 0) return;
        break;
      }
    }
    const entity = entities![0];
    const measurements = entity.measurements;
    if (measurements === undefined || measurements.length === 0) return;
    setExistingData(measurements);
  }, [apiState, subItemId, resourceType, spotId]);

  const postData = async (data: ISimpleMeasurement[]) => {
    try {
      const token = await getTokenSilently();
      const action = actionCreator({
        url: POST_URL,
        method: 'POST',
        body: data,
        token,
        resource: resourceType,
      });
      //console.log(action);
      apiRequest(apiDispatch, action);
      handleSubmitClose();
    } catch (error) {
      throw error;
    }
  };

  return (
    <>
      <Container>
        <Formik
          initialValues={{
            measurements: [],
          }}
          onSubmit={(values, bag) => {
            // console.log(values);
            bag.setSubmitting(false);
            postData(values.measurements as ISimpleMeasurement[]).catch(
              (err) => {
                console.error(err);
              },
            );
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
                    type={
                      resourceType === 'gInputMeasurements'
                        ? 'gInputMeasurements'
                        : 'pplantMeasurements'
                    }
                    title={title}
                    showDataAggregationText={false}
                  ></InfoText>
                ) : (
                  <h3 className='is-title is-3'>
                    CSV Daten Upload für {title}
                  </h3>
                )}
                <NewUploadBox
                  existingData={existingData}
                  unboxed={true}
                  type={
                    resourceType === 'gInputMeasurements'
                      ? 'gInputMeasurements'
                      : 'pplantMeasurements'
                  }
                  title={'Messwerte'}
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
