import React from "react";
import { useAuth0 } from "../lib/auth/react-auth0-wrapper";
import { NavLink } from "react-router-dom";
import { RouteNames } from "../lib/common/enums";
import { APP_VERSION } from "../version";
import { APP_STAGE } from "../lib/common/constants";

const NavBar = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <NavLink
          activeClassName={"navbar-item--is-active"}
          exact={true}
          className="navbar-item"
          to={`/${RouteNames.index}`}
        >
          <img src="/logo-icon-invers@2x.png" alt="" />{" "}
          <strong className="" style={{ paddingLeft: "1em" }}>
            {`Flusshygiene ${APP_VERSION}-${APP_STAGE}`}
          </strong>
          {/* <div>Flusshygiene/Badegewässer Logo</div> */}
        </NavLink>
      </div>
      <input
        type="checkbox"
        role="button"
        id="navbar-burger-toggle"
        className="navbar-burger-toggle is-hidden"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample"
      />

      <label htmlFor="navbar-burger-toggle" className="navbar-burger">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </label>
      <div className="navbar-menu">
        <div className="navbar-start">
          {/* <NavLink to={`/${RouteNames.index}`} className='navbar-item'>
            <strong className=''>Flusshygiene</strong>
          </NavLink> */}
          {/* <NavLink
            activeClassName={'navbar-item--is-active'}
            // activeStyle={{ fontWeight: 800 }}
            to={`/${RouteNames.questionnaire}`}
            className='navbar-item'
          >
            Standortbewertung
          </NavLink> */}
          {/* <NavLink
            to={`/${RouteNames.info}`}
            activeClassName={'navbar-item--is-active'}
            className='navbar-item'
          >
            Vorhersage Modell
          </NavLink> */}
          {/* {isAuthenticated && (
            <NavLink
              to='/external-api'
              activeClassName={'navbar-item--is-active'}
              className='navbar-item'
            >
              External API
            </NavLink>
          )} */}
        </div>
        <div className="navbar-end">
          {!isAuthenticated && (
            <div className="navbar-item">
              <div className="buttons">
                <button className="button is-hidden">Registrieren</button>
                <button
                  className="button is-small is-primary"
                  onClick={() =>
                    loginWithRedirect({
                      redirect_uri: `${window.location.protocol}//${window.location.host}/${RouteNames.profile}`,
                    })
                  }
                >
                  Einloggen
                </button>
              </div>
            </div>
          )}
          {isAuthenticated && (
            <div className="navbar-item">
              <div className="buttons buttons__--size">
                <NavLink
                  to={`/${RouteNames.helpdesk}`}
                  className="button is-small"
                >
                  Support
                </NavLink>
                <NavLink
                  to={`/${RouteNames.profile}`}
                  className="button is-small"
                >
                  Profil
                </NavLink>
                <button
                  className="button is-small"
                  onClick={() =>
                    logout({
                      returnTo: `${window.location.protocol}//${window.location.host}`,
                    })
                  }
                >
                  Ausloggen
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
