import React from 'react';

export const Container: React.FC<{
  children: JSX.Element[] | JSX.Element | undefined;
}> = ({ children }) => {
  return (
    <div className='container info'>
      <div className='columns  is-centered'>
        <div className='column is-10'>{children}</div>
      </div>
    </div>
  );
};
