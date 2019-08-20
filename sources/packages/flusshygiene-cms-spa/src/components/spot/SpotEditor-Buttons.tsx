import React from 'react';
export const SpotEditorButons: React.FC<{
  isSubmitting: boolean;
  handleEditModeClick: () => any;
}> = ({ isSubmitting, handleEditModeClick }) => {
  return (
    <div className='field is-grouped is-grouped-right'>
      <p className='control'>
        <button
          className='button is-primary'
          type='submit'
          disabled={isSubmitting}
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
        >
          Abbrechen
        </button>
      </p>
    </div>
  );
};
