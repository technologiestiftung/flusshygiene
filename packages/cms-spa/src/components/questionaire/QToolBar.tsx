import React from 'react';
import { IconInfo, IconTimes, IconFileAlt } from '../fontawesome-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faInfo } from '@fortawesome/free-solid-svg-icons';
import { ButtonIcon as Button } from '../Buttons';
export const QToolBar: React.FC<{
  handleInfoClick: (e: React.ChangeEvent<any>) => void;
  handleReportClick: (e: React.ChangeEvent<any>) => void;
  handleResetClick: (e: React.ChangeEvent<any>) => void;
  children?: any;
  isSubmitting?: boolean;
}> = ({ handleInfoClick, children, handleReportClick, handleResetClick }) => {
  return (
    <>
      <div className='buttons buttons__--size'>
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
          <IconFileAlt />
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
    </>
  );
};
