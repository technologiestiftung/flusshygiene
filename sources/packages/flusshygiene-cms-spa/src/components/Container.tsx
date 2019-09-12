import React from 'react';

export const Container: React.FC<{
  containerClassName?: string;
  columnClassName?: string;
  children: any;
}> = ({ children, containerClassName, columnClassName }) => {
  return (
    <div
      className={
        containerClassName !== undefined
          ? `container ${containerClassName}`
          : 'container'
      }
    >
      <div className='columns is-centered'>
        <div
          className={`column ${
            columnClassName !== undefined ? columnClassName : 'is-10'
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
