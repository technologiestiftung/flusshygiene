import React from 'react';

export const ButtonIconTB: React.FC<{
  isActive?: boolean;
  handleClick?: (event: React.ChangeEvent<any>) => void;
  cssId?: string;
  children?: any;
  dataTestId?: string;
  additionalClassNames?: string;
  isSubmitting?: boolean;
  type?: 'button' | 'submit' | 'reset';
}> = ({
  isActive,
  handleClick,
  cssId,
  children,
  dataTestId,
  additionalClassNames,
  isSubmitting = false,
  type = 'button',
}) => {
  return (
    <button
      type={type}
      data-testid={dataTestId}
      className={`button is-small is-badge-small ${
        isActive ? 'is-active' : ''
      } ${additionalClassNames !== undefined ? additionalClassNames : ''}`}
      onClick={handleClick}
      id={cssId}
      disabled={isSubmitting}
    >
      <span className='icon is-small'>{children}</span>
    </button>
  );
};
