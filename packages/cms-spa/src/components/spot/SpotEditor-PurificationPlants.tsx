import React from 'react';
import * as Yup from 'yup';
import { Formik, Form, FieldArray } from 'formik';
import { FormikButtons } from './formik-helpers/FormikButtons';
import { IPurificationPlant } from '../../lib/common/interfaces';
import { SpotEditorInput } from './elements/SpotEditor-Input';
import { SpotEditorBox } from './elements/SpotEditor-Box';
import { ButtonIcon as Button } from '../Buttons';
import { IconPlus, IconMinus } from '../fontawesome-icons';
import { UploadBox } from './elements/SpotEditor-UploadBox';
import { defaultMeasurementsSchema } from '../../lib/utils/spot-validation-schema';

const pplantSchema = Yup.object().shape({
  purificationPlants: Yup.array().of(
    Yup.object().shape({
      name: Yup.string()
        .min(3, 'Der Name ist zu kurz.')
        .max(50, 'Der Name ist zu lang.')
        .required('Required'),
      url: Yup.string().url('Keine valide URL.'),
    }),
  ),
});

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
        validationSchema={pplantSchema}
        enableReinitialize={true}
        onSubmit={(values, { setSubmitting }) => {
          console.log('values in pp form', values);
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
                            <SpotEditorInput
                              label={'Name'}
                              type={'text'}
                              name={`purificationPlants[${index}].name`}
                            >
                              <Button
                                text={'Klärwerk entfernen'}
                                handleClick={() => arrayHelpers.remove(index)}
                              >
                                <IconMinus />
                              </Button>
                            </SpotEditorInput>
                            {/* <Field
                              name={`purificationPlants[${index}].name`}
                            ></Field>{' '} */}
                            <SpotEditorInput
                              label={'http (s) url'}
                              type={'text'}
                              name={`purificationPlants[${index}].url`}
                            >
                              <Button
                                text={'Klärwerk entfernen'}
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
                              fieldNameFile={`purificationPlants[${index}].measurements`}
                              fieldNameUrl={'url'}
                              type={'pplantMeasurements'}
                              props={props}
                              schema={defaultMeasurementsSchema}
                            ></UploadBox>
                            {(() => {
                              if (
                                index !==
                                props.values.purificationPlants.length - 1
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
                      <SpotEditorBox title={'Klärwerke'}>
                        <div className='buttons'>
                          {' '}
                          <Button
                            text={'Klärwerk hinzufügen'}
                            handleClick={() =>
                              arrayHelpers.insert(0, {
                                name: '',
                                url: '',
                              })
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
                        <SpotEditorBox title={'Klärwerke'}>
                          <div className='buttons'>
                            <Button
                              text={'Klärwerk hinzufügen'}
                              type='button'
                              handleClick={() =>
                                arrayHelpers.push({ name: 'foo', url: '' })
                              }
                            >
                              <IconPlus></IconPlus>
                            </Button>
                          </div>
                        </SpotEditorBox>
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
