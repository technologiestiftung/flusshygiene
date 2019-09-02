import React from 'react';
import { IconCSV } from '../fontawesome-icons';
export const SpotEditorFile: React.FC<{
  name: string;
  type: string;
  label: string;
  disabled: boolean;
  onChange: (event) => void;
}> = ({ name, label, type, onChange, disabled }) => {
  return (
    <div className='file has-name is-right'>
      <label className='file-label' htmlFor={name}>
        <input
          className='file-input'
          type={type}
          name={name}
          onChange={onChange}
          disabled={disabled}
        />

        <span className='file-cta'>
          <span className='file-icon'>
            <IconCSV />
          </span>
          <span className='file-label'>Datei auswählen…</span>
        </span>
        <span className='file-name'>{label}</span>
      </label>
    </div>
  );
};
