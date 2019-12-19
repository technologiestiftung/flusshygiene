import React from 'react';
export const Spinner: React.FC = () => {
  return (
    <span className='spinner'>
      <div className='bounce1'></div>
      <div className='bounce2'></div>
      <div className='bounce3'></div>
    </span>
  );
};
