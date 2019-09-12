import { Field, ErrorMessage } from 'formik';

// SpotEditorInput.tsx;
import React from 'react';
export const SpotEditorInput: React.FC<{
  name: string;
  type: string;
  label: string;
  // handleChange: (event) => void;
}> = ({ name, label, type }) => {
  // console.log(name);
  return (
    <div className='field is-horizontal'>
      <div className='field-label is-normal'>
        <label htmlFor={name} className='label'>
          {label}
        </label>
      </div>
      <div className='field-body'>
        <div className='field'>
          <div className='control'>
            <Field
              type={type}
              name={name}
              className='input'
              id={name}
              data-testid={`test-input-${name}`}
              // onChange={handleChange}
            />
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
