import React from 'react';
export const SpotEditorButtons: React.FC<{
  isSubmitting: boolean;
  handleSubmit: (e?: any | undefined) => void;
  handleEditModeClick: () => any;
}> = ({ isSubmitting, handleEditModeClick, handleSubmit }) => {
  return (
    <div className='field is-grouped is-grouped-left'>
      <p className='control'>
        <button
          className='button is-primary'
          type='submit'
          disabled={isSubmitting}
          onClick={handleSubmit}
        >
          Speichern
        </button>
      </p>
      <p className='control'>
        <button
          className='button is-is-light'
          type='button'
          disabled={isSubmitting}
          onClick={handleEditModeClick}
          data-testid={'handle-edit-mode-button'}
        >
          Abbrechen
        </button>
      </p>
    </div>
  );
};
