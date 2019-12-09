import React from 'react';
import { Formik, Form, FieldArray, Field } from 'formik';
import { FormikButtons } from './formik-helpers/FormikButtons';
import { IPurificationPlant } from '../../lib/common/interfaces';
export interface ISpotEditorPurificationPlantsInitialValues {
  purificationPlants: IPurificationPlant[];
}
export const SpotEditorPurificationPlants: React.FC<{
  initialValues: ISpotEditorPurificationPlantsInitialValues;
  spotId: number;
  handeCloseClick: (e?: React.ChangeEvent<any> | undefined) => void;
  handleInfoClick: (e?: React.ChangeEvent<any> | undefined) => void;
}> = ({ initialValues, spotId, handeCloseClick, handleInfoClick }) => {
  return (
    <>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        onSubmit={(values, { setSubmitting }) => {
          console.log('vlaues in pp form', values);
          setSubmitting(true);
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
              ></FormikButtons>
              <FieldArray
                name={'purificationPlants'}
                render={(arrayHelpers) => {
                  if (
                    props.values.purificationPlants &&
                    props.values.purificationPlants.length > 0
                  ) {
                    console.log('got some plants');
                    const fields = props.values.purificationPlants.map(
                      (pplant, index) => {
                        return (
                          <div key={index}>
                            <Field
                              name={`purificationPlants[${index}].name`}
                            ></Field>{' '}
                            <Field
                              name={`purificationPlants[${index}].url`}
                            ></Field>{' '}
                            <div className='buttons'>
                              <button
                                className='button'
                                type='button'
                                onClick={() => arrayHelpers.remove(index)}
                              >
                                - Remove Plant
                              </button>
                              <button
                                className='button'
                                type='button'
                                onClick={() =>
                                  arrayHelpers.insert(index, {
                                    name: 'foo',
                                    url: '',
                                  })
                                } // insert an empty string at a position
                              >
                                + Add Plant
                              </button>
                            </div>
                          </div>
                        );
                      },
                    );
                    return fields;
                  } else {
                    return (
                      <>
                        <div className='buttons'>
                          <button
                            className='button is-small'
                            type='button'
                            onClick={() =>
                              arrayHelpers.push({ name: 'foo', url: '' })
                            }
                          >
                            {/* show this when user has removed all plants from the list */}
                            Add a plant
                          </button>
                        </div>
                      </>
                    );
                  }
                  // return (
                  //   <>
                  //     {initialValues.purificationPlants &&
                  //     initialValues.purificationPlants.length > 0 ? (
                  //       props.values.purificationPlants.map((pplant, index) => {
                  //         return (
                  //           <div key={index}>
                  //             <Field
                  //               name={`purificationPlants[${index}].name`}
                  //             ></Field>{' '}
                  //             <button
                  //               type='button'
                  //               onClick={() => arrayHelpers.remove(index)}
                  //             >
                  //               - Remove Plant
                  //             </button>
                  //             <button
                  //               type='button'
                  //               onClick={() =>
                  //                 arrayHelpers.insert(index, {
                  //                   name: 'foo',
                  //                   url: '',
                  //                 })
                  //               } // insert an empty string at a position
                  //             >
                  //               + Add Plant
                  //             </button>
                  //           </div>
                  //         );
                  //       })
                  //     ) : (
                  //       <>
                  //         <button
                  //           type='button'
                  //           onClick={() =>
                  //             arrayHelpers.push({ name: 'foo', url: '' })
                  //           }
                  //         >
                  //           {/* show this when user has removed all plants from the list */}
                  //           Add a plant
                  //         </button>
                  //       </>
                  //     )}
                  //   </>
                  // );
                }}
              ></FieldArray>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};
