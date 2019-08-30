import React from 'react';

export const Container: React.FC<{
  children: JSX.Element[] | JSX.Element | undefined | boolean;
}> = ({ children }) => {
  return (
    <div className='container info'>
      <div className='columns  is-centered'>
        <div className='column is-10'>{children}</div>
      </div>
    </div>
  );
};
