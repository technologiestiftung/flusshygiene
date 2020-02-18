import React from 'react';
import { IconSave, IconCloseWin, IconInfo } from '../../fontawesome-icons';

export const FormikButtons: React.FC<{
  props: any;
  handleCancelClick: (e?: React.ChangeEvent<any> | undefined) => void;
  infoModalClickHandler: () => void;
}> = ({ props, handleCancelClick, infoModalClickHandler }) => {
  return (
    <div className='buttons  buttons__--size'>
      <button
        className='button is-primary is-small'
        type='submit'
        disabled={props.isSubmitting}
      >
        <span className='icon is-small'>
          <IconSave />
        </span>
        <span>Speichern</span>{' '}
      </button>
      <button
        className='button is-small'
        type='button'
        disabled={props.isSubmitting}
        onClick={handleCancelClick}
        data-testid={'handle-edit-mode-button'}
      >
        <span className='icon is-small'>
          <IconCloseWin />
        </span>
        <span>Abbrechen</span>{' '}
      </button>
      <button
        className='button is-small'
        type='button'
        onClick={infoModalClickHandler}
        data-testid={'handle-info-mode-button'}
      >
        <span className='icon is-small'>
          <IconInfo />
        </span>
        <span>Info</span>{' '}
      </button>
    </div>
  );
};
