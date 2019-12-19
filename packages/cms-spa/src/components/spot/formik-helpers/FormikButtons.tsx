import React from 'react';
import { IconSave, IconCloseWin, IconInfo } from '../../fontawesome-icons';

export const FormikButtons: React.FC<{
  props: any;
  handleCancelClick: (e?: React.ChangeEvent<any> | undefined) => void;
  infoModalClickHandler: () => void;
}> = ({ props, handleCancelClick, infoModalClickHandler }) => {
  return (
    <div className='buttons'>
      <button
        className='button is-primary is-small'
        type='submit'
        disabled={props.isSubmitting}
      >
        <span>Speichern</span>{' '}
        <span className='icon is-small'>
          <IconSave />
        </span>
      </button>
      <button
        className='button is-light is-small'
        type='button'
        disabled={props.isSubmitting}
        onClick={handleCancelClick}
        data-testid={'handle-edit-mode-button'}
      >
        <span>Abbrechen</span>{' '}
        <span className='icon is-small'>
          <IconCloseWin />
        </span>
      </button>
      <button
        className='button is-light is-small'
        type='button'
        onClick={infoModalClickHandler}
        data-testid={'handle-info-mode-button'}
      >
        <span>Info</span>{' '}
        <span className='icon is-small'>
          <IconInfo />
        </span>
      </button>
    </div>
  );
};
