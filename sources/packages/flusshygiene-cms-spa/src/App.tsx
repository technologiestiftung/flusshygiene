import React from 'react';
import NavBar from './components/Navbar';
import Home from './components/Home';
import { useAuth0 } from './lib/auth/react-auth0-wrapper';
import { Router, Route, Switch } from 'react-router-dom';
import Profile from './components/Profile';
import PrivateRoute from './components/PrivateRoute';
import ExternalApi from './components/ExternalApi';
import Spot from './components/Spot';
import Info from './components/Info';
import { RouteNames } from './lib/common/enums';
import history from './lib/history';
import { QuestionsIntro } from './components/questionaire/QuestionsIntro';
import { QA } from './components/questionaire/QA-entrypoint';
import { Page404 } from './components/Page404';

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
    <React.Fragment>
      <Router history={history}>
        <main className='section'>
          <header>
            <NavBar />
          </header>
          <Switch>
            {/* https://tylermcginnis.com/react-router-pass-props-to-components/ */}
            <Route path='/' exact component={Home} />
            <PrivateRoute path='/badestellen/:id' component={Spot} />
            <Route path='/info' component={Info} />
            {/* <Route
              path={`/${RouteNames.questionnaire}`}
              component={QuestionaireIntro}
            /> */}
            <Route path={`/${RouteNames.questionnaire}/:id`} component={QA} />
            <Route
              path={`/${RouteNames.questionnaire}`}
              component={QuestionsIntro}
            />
            <PrivateRoute path='/profile' component={Profile} />
            <PrivateRoute path='/external-api' component={ExternalApi} />
            <Route component={Page404} />
          </Switch>
        </main>
      </Router>
      <footer className='footer'>Footer</footer>
    </React.Fragment>
  );
};

export default App;
