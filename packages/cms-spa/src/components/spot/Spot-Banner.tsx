import React from 'react';
import { Container } from '../Container';
export function Banner(message: string) {
  return (
    <div className='notification spot__calib-notification--on-top'>
      {message}
    </div>
  );
}
