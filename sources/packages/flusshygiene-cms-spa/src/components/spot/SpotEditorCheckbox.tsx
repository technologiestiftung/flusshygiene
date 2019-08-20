import { Field, ErrorMessage } from 'formik';
import '../../assets/styles/spot-editor-checkbox.scss';
// SpotEditorCheckbox.tsx;
import React from 'react';
const SpotEditorCheckbox: React.SFC<{
  name: string;
  type: string;
  label: string;
}> = ({ name, label }) => {
  // console.log(name);
  return (
    <div className='field is-horizontal'>
      <div className='field-label is-normal'>
        <label htmlFor={name} className='label'></label>
      </div>
      <div className='field-body'>
        <div className='field'>
          <div className='control'>
            <label className='checkbox'>
              <Field type='checkbox' name={name} />
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

export default SpotEditorCheckbox;
