import React from 'react';
import { Container } from '../Container';
export const Spinner: React.FC = () => {
  return (
    <>
      <Container>
        <div className='spinner'>
          <div className='bounce1'></div>
          <div className='bounce2'></div>
          <div className='bounce3'></div>
        </div>
      </Container>
      <Container>
        <div className='has-text-centered'>
          <h1 className='is-title is-2'>
            Aktualisiere Badestellen Informationen
          </h1>
        </div>
      </Container>
    </>
  );
};
