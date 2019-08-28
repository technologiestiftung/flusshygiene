import React from 'react';
// import logo from './logo.svg';
import NavBar from './components/Navbar';
import Home from './components/Home';
import { useAuth0 } from './react-auth0-wrapper';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Profile from './components/Profile';
import PrivateRoute from './components/PrivateRoute';
import ExternalApi from './components/ExternalApi';
import Spot from './components/Spot';
import Info from './components/Info';
import { Questionaire } from './components/Questionaire';
import { RouteNames } from './lib/common/enums';

const App: React.FC = () => {
  const { loading } = useAuth0();

  if (loading) {
    return (
      <div className='pageloader is-active'>
        <h1 className='title'>Lade Daten vom Server</h1>
      </div>
    );
  }

  return (
    <main className='section'>
      <BrowserRouter>
        <header>
          <NavBar />
        </header>
        <Switch>
          {/* https://tylermcginnis.com/react-router-pass-props-to-components/ */}
          <Route path='/' exact component={Home} />
          <Route path='/badestellen/:id' component={Spot} />
          <Route path='/info' component={Info} />
          <Route
            path={`/${RouteNames.questionnaire}`}
            component={Questionaire}
          />
          <PrivateRoute path='/profile' component={Profile} />
          <PrivateRoute path='/external-api' component={ExternalApi} />
        </Switch>
      </BrowserRouter>
      <footer className='footer'>Footer</footer>
    </main>
  );
};

export default App;
