import { Field, ErrorMessage } from 'formik';

// SpotEditorInput.tsx;
import React from 'react';
type SpotEditorInputTypes = 'text' | 'number' | 'email';
export const SpotEditorInput: React.FC<{
  name: string;
  type: SpotEditorInputTypes;
  label: string;
  children?: React.ReactNode;
  // handleChange: (event) => void;
}> = ({ name, label, type, children }) => {
  // console.log(name);
  return (
    <div className='field is-horizontal'>
      <div className='field-label is-normal'>
        <label htmlFor={name} className='label'>
          {label}
        </label>
      </div>
      <div className='field-body'>
        <div className={`field ${children !== undefined ? 'is-grouped' : ''}`}>
          <div
            className={`control ${children !== undefined ? 'is-expanded' : ''}`}
          >
            <Field
              type={type}
              name={name}
              className='input is-small'
              id={name}
              data-testid={`test-input-${name}`}
            />
            <ErrorMessage
              name={name}
              component='div'
              className='help is-danger'
            />
          </div>
          {children !== undefined && children}
        </div>
      </div>
    </div>
  );
};
