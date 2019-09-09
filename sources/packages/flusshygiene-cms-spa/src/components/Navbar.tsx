import React, { useEffect } from 'react';
import { useAuth0 } from '../react-auth0-wrapper';
import { NavLink } from 'react-router-dom';
import { RouteNames } from '../lib/common/enums';

const NavBar = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  useEffect(() => {
    console.log(window.location);
    return () => {};
  }, []);

  return (
    <nav className='navbar' role='navigation' aria-label='main navigation'>
      <div className='navbar-brand'>
        <NavLink
          activeClassName={'navbar-item--is-active'}
          exact={true}
          className='navbar-item'
          to={`/${RouteNames.index}`}
        >
          <img src='/logo-icon-invers@2x.png' alt='' />{' '}
          <strong className='' style={{ paddingLeft: '1em' }}>
            Flusshygiene
          </strong>
          {/* <div>Flusshygiene/Badegewässer Logo</div> */}
        </NavLink>
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
          {/* <NavLink to={`/${RouteNames.index}`} className='navbar-item'>
            <strong className=''>Flusshygiene</strong>
          </NavLink> */}
          <NavLink
            activeClassName={'navbar-item--is-active'}
            // activeStyle={{ fontWeight: 800 }}
            to={`/${RouteNames.questionnaire}`}
            className='navbar-item'
          >
            Standortbewertung
          </NavLink>
          <NavLink
            to={`/${RouteNames.info}`}
            activeClassName={'navbar-item--is-active'}
            className='navbar-item'
          >
            Vorhersage Modell
          </NavLink>
          {isAuthenticated && (
            <NavLink
              to='/external-api'
              activeClassName={'navbar-item--is-active'}
              className='navbar-item'
            >
              External API
            </NavLink>
          )}
        </div>
        <div className='navbar-end'>
          {!isAuthenticated && (
            <div className='navbar-item'>
              <div className='buttons'>
                <button className='button is-hidden'>Registrieren</button>
                <button
                  className='button is-primary'
                  onClick={() =>
                    loginWithRedirect({
                      redirect_uri: `${window.location.protocol}//${window.location.host}/profile`,
                    })
                  }
                >
                  Log in
                </button>
              </div>
            </div>
          )}
          {isAuthenticated && (
            <div className='navbar-item'>
              <div className='buttons'>
                <NavLink to='/profile' className='button'>
                  Profile
                </NavLink>
                <button
                  className='button'
                  onClick={() =>
                    logout({
                      returnTo: `${window.location.protocol}//${window.location.host}`,
                    })
                  }
                >
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
