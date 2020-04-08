import React, { useState, useEffect } from "react";
import {
  RequestResourceTypes,
  ClickFunction,
  MGDUploaderDataType,
} from "../../../lib/common/interfaces";
import { REACT_APP_API_HOST } from "../../../lib/config";
import { APIMountPoints, ApiResources } from "../../../lib/common/enums";
import { useAuth0 } from "../../../lib/auth/react-auth0-wrapper";
import { useApi, apiRequest } from "../../../contexts/postgres-api";
import { Formik, Form } from "formik";
import { FormikButtons } from "../formik-helpers/FormikButtons";
import { Container } from "../../Container";
import { InfoText } from "../elements/SpotEditor-Measurments-Info";
import { NewUploadBox } from "../elements/New-UploadBox";
import {
  defaultMeasurementsSchema,
  measurementsSchema,
} from "../../../lib/utils/spot-validation-schema";
import { actionCreator } from "../../../lib/utils/pgapi-actionCreator";

export const MGDUploader: React.FC<{
  userId: number;
  spotId: number;
  dataType: MGDUploaderDataType;
  resourceType: RequestResourceTypes;
  handleCancelClick: ClickFunction;
  handleSubmitClose: ClickFunction;
  title: string;
}> = ({
  userId,
  spotId,
  dataType,
  resourceType,
  handleCancelClick,
  handleSubmitClose,
  title,
}) => {
  const BASE_URL = `${REACT_APP_API_HOST}/${APIMountPoints.v1}/${ApiResources.users}/${userId}/${ApiResources.bathingspots}/${spotId}`;
  const [showInfo, setShowInfo] = useState(true);
  const [apiState, apiDispatch] = useApi();

  const [existingData, setExistingData] = useState<any[]>([]);
  const { getTokenSilently } = useAuth0();

  let POST_URL: string;
  const postData = async (data: any[]) => {
    try {
      switch (dataType) {
        case "discharges":
          POST_URL = `${BASE_URL}/${ApiResources.discharges}`;
          break;
        case "globalIrradiances":
          POST_URL = `${BASE_URL}/${ApiResources.globalIrradiances}`;
          break;
        case "measurements":
          POST_URL = `${BASE_URL}/${ApiResources.measurements}`;
      }
      const token = await getTokenSilently();
      const action = actionCreator({
        url: POST_URL,
        method: "POST",
        resource: dataType,
        token,
        body: data,
      });
      apiRequest(apiDispatch, action);
      handleSubmitClose();
    } catch (error) {
      console.error(error);
    }
  };

  /**
   *
   * effects
   *
   */
  useEffect(() => {
    const filteredSpots = apiState.spots.filter((spot) => spot.id === spotId);
    if (filteredSpots.length === 0) return;
    const spot = filteredSpots[0];
    let data: any[] | undefined;
    switch (dataType) {
      case "discharges": {
        data = spot.discharges;
        if (data === undefined || data.length === 0) return;
        break;
      }
      case "globalIrradiances": {
        data = spot.globalIrradiances;
        if (data === undefined || data.length === 0) return;
        break;
      }
      case "measurements": {
        data = spot.measurements;
        if (data === undefined || data.length === 0) return;
        break;
      }
    }
    setExistingData(data);
  }, [apiState, resourceType, spotId, dataType]);

  return (
    <>
      <Container>
        <Formik
          initialValues={{
            measurements: [],
          }}
          onSubmit={(values, bag) => {
            bag.setSubmitting(false);
            postData(values.measurements).catch((err) => {
              console.error(err);
            });
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
                />
                {showInfo ? (
                  <InfoText
                    type={dataType}
                    showDataAggregationText={false}
                    title={title}
                  ></InfoText>
                ) : (
                  <h3 className="is-title is-3">
                    CSV Daten Upload für {title}
                  </h3>
                )}
                <NewUploadBox
                  existingData={existingData}
                  unboxed={true}
                  type={dataType}
                  title={title}
                  fieldNameFile={"measurements"}
                  fieldNameUrl={"url"}
                  props={props}
                  schema={(() => {
                    // console.log(dataType);
                    switch (dataType) {
                      case "measurements":
                        return measurementsSchema;
                      case "discharges":
                      case "globalIrradiances":
                        return defaultMeasurementsSchema;
                    }
                  })()}
                ></NewUploadBox>
              </Form>
            );
          }}
        </Formik>
      </Container>
    </>
  );
};
