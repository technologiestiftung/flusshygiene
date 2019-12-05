import React from 'react';
export const Banner: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className='notification spot__calib-notification--on-top'>
      {message}
    </div>
  );
};
