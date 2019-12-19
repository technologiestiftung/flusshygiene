import React, { useState, useEffect } from 'react';
import { Formik, Form, FieldArray } from 'formik';
import { FormikButtons } from './formik-helpers/FormikButtons';
import {
  IPurificationPlant,
  IApiAction,
  ICollectionWithSubitem,
} from '../../lib/common/interfaces';
import { SpotEditorInput } from './elements/SpotEditor-Input';
import { SpotEditorBox } from './elements/SpotEditor-Box';
import { ButtonIcon as Button } from '../Buttons';
import { IconPlus, IconMinus } from '../fontawesome-icons';
import { UploadBox } from './elements/SpotEditor-UploadBox';
import { useAuth0 } from '../../lib/auth/react-auth0-wrapper';

import { defaultMeasurementsSchema } from '../../lib/utils/spot-validation-schema';
import { REACT_APP_API_HOST } from '../../lib/config';
import { ApiResources, APIMountPoints } from '../../lib/common/enums';
import { actionCreator } from '../../lib/utils/pgapi-actionCreator';
import { apiRequest, useApi } from '../../contexts/postgres-api';
import { applyChange, observableDiff } from 'deep-diff';

export interface ISpotEditorCollectionWithSubItemsInitialValues {
  collection: IPurificationPlant[] | ICollectionWithSubitem[];
}
export const SpotEditorCollectionWithSubitem: React.FC<{
  initialValues: ISpotEditorCollectionWithSubItemsInitialValues;
  spotId: number;
  uploadBoxResourceType: 'pplantMeasurements' | 'gInputMeasurements';
  resourceType: ApiResources.purificationPlants | ApiResources.genericInputs;
  title: string;
  validationSchema: any;
  handeCloseClick: (e?: React.ChangeEvent<any> | undefined) => void;
  handleInfoClick: (e?: React.ChangeEvent<any> | undefined) => void;
}> = ({
  initialValues,
  spotId,
  handeCloseClick,
  handleInfoClick,
  title,
  uploadBoxResourceType: uploadBoxType,
  resourceType,
  validationSchema,
}) => {
  const { user, getTokenSilently } = useAuth0();
  const [, apiDispatch] = useApi();
  const [isDirty, setIsDirty] = useState(false);

  const [cleanedInitialValues, setCleanedInitialValues] = useState<
    ISpotEditorCollectionWithSubItemsInitialValues
  >({ collection: [] });

  useEffect(() => {
    const values: ISpotEditorCollectionWithSubItemsInitialValues = JSON.parse(
      JSON.stringify(initialValues),
    );

    values.collection.forEach((plant) => {
      if (plant.measurements && plant.measurements.length > 0) {
        plant.measurements = [];
      }
    });
    setCleanedInitialValues(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const postData: (options: {
    values: ISpotEditorCollectionWithSubItemsInitialValues;
    spotId: number;
  }) => Promise<void> = async (options) => {
    if (isDirty === false) return;
    const { collection } = options.values;
    const sId = options.spotId;
    const token = await getTokenSilently();
    const baseUrl = `${REACT_APP_API_HOST}/${APIMountPoints.v1}/${ApiResources.users}/${user.pgapiData.id}/${ApiResources.bathingspots}/${sId}/${resourceType}`;
    const actions: IApiAction[] = [];

    /**
     * Delete actions
     */
    const deletedItems = cleanedInitialValues.collection.filter((item) => {
      let found: boolean = false;
      for (const newItem of collection) {
        if (item.id === newItem.id) {
          found = true;
          break;
        }
      }
      if (found === true) {
        return null;
      } else {
        return item;
      }
    });
    // console.log('delted items', deletedItems);
    /**
     * delete actions
     */
    deletedItems.forEach((delItem) => {
      actions.push(
        actionCreator({
          body: {},
          token,
          url: `${baseUrl}/${delItem.id}`,
          method: 'DELETE',
          resource: resourceType,
        }),
      );
    });
    /**
     * PUT actions
     */
    cleanedInitialValues.collection.forEach((item, index) => {
      collection.forEach((updatedItem, i) => {
        if (updatedItem.id === item.id) {
          let target = {};
          observableDiff(item, updatedItem, function(d) {
            // Apply all changes except to the name property...
            if (d.path === undefined) return;
            // if (d.path[d.path.length - 1] !== 'name') {
            applyChange(target, updatedItem, d);
            // }
          });

          if (Object.keys(target).length > 0) {
            // console.log(`diff for item.id ${item.id}`);
            actions.push(
              actionCreator({
                body: target,
                token,
                url: `${baseUrl}/${item.id}`,
                method: 'PUT',
                resource: resourceType,
              }),
            );
          }
        }
      });
    });
    /**
     * POST actions
     */
    for (const item of collection) {
      if (item.id !== undefined) {
        continue;
      }
      actions.push(
        actionCreator({
          body: item,
          token,
          url: baseUrl,
          method: 'POST',
          resource: resourceType,
        }),
      );
    }

    // console.log('isDirty', isDirty);
    // console.log('actions', actions);

    if (actions.length > 0) {
      actions.forEach((action) => {
        apiRequest(apiDispatch, action);
      });
    }
  };
  return (
    <>
      <Formik
        initialValues={cleanedInitialValues}
        validationSchema={validationSchema}
        enableReinitialize={true}
        onSubmit={(values, bag) => {
          // console.log('values in pp form', values);
          bag.setSubmitting(true);
          postData({ values, spotId });
          handeCloseClick();
        }}
      >
        {(props) => {
          // console.log('touched', props.touched);
          // console.log('dirty', props.dirty);
          setIsDirty(props.dirty);
          // setTouchedValues(props.touched);
          return (
            <Form>
              <FormikButtons
                props={props}
                handleCancelClick={handeCloseClick}
                infoModalClickHandler={handleInfoClick}
              ></FormikButtons>
              <FieldArray
                name={'collection'}
                render={(arrayHelpers) => {
                  if (
                    props.values.collection &&
                    props.values.collection.length > 0
                  ) {
                    const fields = props.values.collection.map(
                      (pplant, index) => {
                        if (pplant.url === null) {
                          pplant.url = '';
                        }
                        return (
                          <div key={index}>
                            <SpotEditorInput
                              label={'Name'}
                              type={'text'}
                              name={`collection[${index}].name`}
                            >
                              <Button
                                text={`${title} entfernen`}
                                handleClick={() => arrayHelpers.remove(index)}
                              >
                                <IconMinus />
                              </Button>
                            </SpotEditorInput>
                            {/* <Field
                              name={`collection[${index}].name`}
                            ></Field>{' '} */}
                            <SpotEditorInput
                              label={'http (s) url'}
                              type={'text'}
                              name={`collection[${index}].url`}
                            >
                              <Button
                                text={`${title} entfernen`}
                                additionalClassNames={'is-invisible'}
                              >
                                {' '}
                                <IconMinus />
                              </Button>
                            </SpotEditorInput>
                            <UploadBox
                              addionalClassNames={'add-padding-top'}
                              hasNoUrlField={true}
                              unboxed={true}
                              title={'Messdaten hochladen'}
                              fieldNameFile={`collection[${index}].measurements`}
                              fieldNameUrl={'url'}
                              type={uploadBoxType}
                              props={props}
                              schema={defaultMeasurementsSchema}
                            ></UploadBox>
                            {(() => {
                              if (
                                index !==
                                props.values.collection.length - 1
                              ) {
                                return <hr />;
                              }
                              return;
                            })()}
                          </div>
                        );
                      },
                    );
                    return (
                      <SpotEditorBox title={title}>
                        <div className='buttons'>
                          {' '}
                          <Button
                            text={`${title} hinzufügen`}
                            handleClick={() =>
                              arrayHelpers.insert(
                                props.values.collection.length,
                                {
                                  name: '',
                                  url: '',
                                },
                              )
                            }
                          >
                            <IconPlus />
                          </Button>
                        </div>
                        <hr />

                        {fields}
                      </SpotEditorBox>
                    );
                  } else {
                    return (
                      <>
                        <SpotEditorBox title={title}>
                          <div className='buttons'>
                            <Button
                              text={`${title} hinzufügen`}
                              type='button'
                              handleClick={() =>
                                arrayHelpers.push({ name: '', url: '' })
                              }
                            >
                              <IconPlus></IconPlus>
                            </Button>
                          </div>
                        </SpotEditorBox>
                      </>
                    );
                  }
                }}
              ></FieldArray>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};
