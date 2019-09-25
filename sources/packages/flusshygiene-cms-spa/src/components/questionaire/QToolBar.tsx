import React from 'react';
import { IconInfo, IconSave, IconTimes } from '../fontawesome-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faInfo } from '@fortawesome/free-solid-svg-icons';
import { ButtonIconTB as Button } from '../Buttons';
export const QToolBar: React.FC<{
  handleInfoClick: (e: React.ChangeEvent<any>) => void;
  handleReportClick: (e: React.ChangeEvent<any>) => void;
  handleResetClick: (e: React.ChangeEvent<any>) => void;
  children: any;
  isSubmitting?: boolean;
}> = ({ handleInfoClick, children, handleReportClick, handleResetClick }) => {
  return (
    <>
      <div className='buttons'>
        <Button
          dataTestId={'qtoolbar-i-button'}
          cssId={'info'}
          handleClick={handleInfoClick}
          text={'Info'}
        >
          <IconInfo />
        </Button>
        <Button
          type='button'
          cssId={'save'}
          handleClick={handleReportClick}
          // isSubmitting={isSubmitting}
          text={'Zum Report'}
        >
          <IconSave />
        </Button>
        <Button
          type='button'
          cssId='reset-answers'
          handleClick={handleResetClick}
          text={'Formular zurücksetzen'}
        >
          <IconTimes />
        </Button>
      </div>
      {/* <Button cssId={'fwd'} handleClick={handleClick}>
          <IconNext />
        </Button> */}
      <div className='buttons'>{children}</div>
    </>
  );
};
