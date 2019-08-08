import React from 'react';
import { useAuth0 } from '../react-auth0-wrapper';
import { Link } from 'react-router-dom';
import { RouteNames } from '../lib/enums';

const NavBar = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <nav className='navbar' role='navigation' aria-label='main navigation'>
      <div className='navbar-brand'>
        <a className='navbar-item' href={`/${RouteNames.index}`}>
          <div>Flusshygiene/Badegewässer Logo</div>
        </a>
      </div>
      <input
        type='checkbox'
        role='button'
        id='navbar-burger-toggle'
        className='navbar-burger-toggle is-hidden'
        aria-label='menu'
        aria-expanded='false'
        data-target='navbarBasicExample'
      />

      <label htmlFor='navbar-burger-toggle' className='navbar-burger'>
        <span aria-hidden='true'></span>
        <span aria-hidden='true'></span>
        <span aria-hidden='true'></span>
      </label>
      <div className='navbar-menu'>
        <div className='navbar-start'>
          <Link to={`/${RouteNames.index}`} className='navbar-item'>
            Home
          </Link>
          <Link to={`/${RouteNames.questionnaire}`} className='navbar-item'>
            Standortbewertung
          </Link>
          <Link to={`/${RouteNames.info}`} className='navbar-item'>
            Vorhersage Modell
          </Link>
          {isAuthenticated && (
            <Link to='/external-api' className='navbar-item'>
              External API
            </Link>
          )}
        </div>
        <div className='navbar-end'>
          {!isAuthenticated && (
            <div className='navbar-item'>
              <div className='buttons'>
                <button className='button is-hidden'>Registrieren</button>
                <button
                  className='button is-primary'
                  onClick={() => loginWithRedirect({})}
                >
                  Log in
                </button>
              </div>
            </div>
          )}
          {isAuthenticated && (
            <div className='navbar-item'>
              <div className='buttons'>
                <Link to='/profile' className='button'>
                  Profile
                </Link>
                <button className='button' onClick={() => logout()}>
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
