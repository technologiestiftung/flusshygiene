import React from 'react';
import { Container } from './Container';
import { Link } from 'react-router-dom';

export const Page404 = () => {
  return (
    <>
      <Container>
        <div className='is-hero'>
          <h1 className='is-title is-1'>Ups. Diese Seite existiert nicht.</h1>
          <div className='content'>
            <p>
              Besser Sie gehen nochmal zurück zum <Link to='/'>Anfang.</Link>
            </p>
          </div>
        </div>
      </Container>
    </>
  );
};
