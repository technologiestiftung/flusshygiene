import React from 'react';
import { ClickFunction } from '../../../lib/common/interfaces';

export type BannerType = 'normal' | 'warning' | 'error';
export const Banner: React.FC<{
  message: string;
  handleClose: ClickFunction;
  bannerType?: BannerType;
}> = ({ message, handleClose, bannerType }) => {
  let typeClassname: string;
  switch (bannerType) {
    case 'normal': {
      typeClassname = 'is-primary';
      break;
    }
    case 'warning': {
      typeClassname = 'is-warning';
      break;
    }
    case 'error': {
      typeClassname = 'is-danger';
      break;
    }
    default: {
      typeClassname = '';
      break;
    }
  }
  return (
    <div
      className={`notification spot__calib-notification--on-top ${typeClassname}`}
    >
      <button className='delete' onClick={handleClose}></button>
      {message}
    </div>
  );
};
