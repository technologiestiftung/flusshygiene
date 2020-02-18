import React from 'react';
import { IconFileUplad } from '../fontawesome-icons';

export const CustomFileUpload: React.FC<{
  handleChangeEvent: (event: React.ChangeEvent<HTMLInputElement>) => void;
  text?: string;
  children?: React.ReactNode;
}> = ({ children, text, handleChangeEvent }) => {
  return (
    <>
      <label className='button is-small'>
        <input
          id='custom-file-upload'
          type='file'
          style={{ display: 'none' }}
          onChange={handleChangeEvent}
          className={'input__custom-file-upload--hidden'}
        />
        <span className='icon is-small'>
          <IconFileUplad></IconFileUplad>
        </span>{' '}
        {text && <span>{text}</span>}
        {children}
      </label>
    </>
  );
};
