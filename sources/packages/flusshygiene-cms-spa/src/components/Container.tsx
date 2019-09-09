import React from 'react';

export const Container: React.FC<{
  className?: string;
  children: JSX.Element[] | JSX.Element | undefined | boolean;
}> = ({ children, className }) => {
  return (
    <div
      className={
        className !== undefined
          ? `container info ${className}`
          : 'container info'
      }
    >
      <div className='columns  is-centered'>
        <div className='column is-10'>{children}</div>
      </div>
    </div>
  );
};
