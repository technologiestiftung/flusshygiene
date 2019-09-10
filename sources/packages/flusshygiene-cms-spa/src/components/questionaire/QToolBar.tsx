import React from 'react';
import { IconInfo, IconSave } from '../fontawesome-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faInfo } from '@fortawesome/free-solid-svg-icons';
import { ButtonIconTB as Button } from '../Buttons';
export const QToolBar: React.FC<{
  handleClick: (e: React.ChangeEvent<any>) => void;
  children: any;
  isSubmitting: boolean;
}> = ({ handleClick, children, isSubmitting }) => {
  return (
    <>
      <div className='buttons'>
        <Button
          dataTestId={'qtoolbar-i-button'}
          cssId={'info'}
          handleClick={handleClick}
        >
          <IconInfo />
        </Button>
        <Button
          type='submit'
          cssId={'save'}
          // handleClick={handleClick}
          isSubmitting={isSubmitting}
        >
          <IconSave />
        </Button>
        {/* <Button cssId={'fwd'} handleClick={handleClick}>
          <IconNext />
        </Button> */}
        {children}
      </div>
    </>
  );
};
