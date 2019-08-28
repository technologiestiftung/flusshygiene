import { Field, ErrorMessage } from 'formik';
import '../../assets/styles/spot-editor-checkbox.scss';
// SpotEditorCheckbox.tsx;
import React from 'react';
export const SpotEditorCheckbox: React.FC<{
  name: string;
  type: string;
  label: string;
  value: boolean;
}> = ({ name, label, value }) => {
  // console.log(name);
  return (
    <div className='field is-horizontal'>
      <div className='field-label is-normal'>
        <div className='label'></div>
      </div>
      <div className='field-body'>
        <div className='field'>
          <div className='control'>
            <label htmlFor={name} className='checkbox'>
              <Field type='checkbox' name={name} checked={value} id={name} />
              <span className='form__checkbox--distance'>{label}</span>
            </label>
            <ErrorMessage
              name={name}
              component='div'
              className='help is-danger'
            />
          </div>
        </div>
      </div>
    </div>
  );
};
