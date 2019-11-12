import React from 'react';
import { Helmet } from 'react-helmet';

import Spot from './components/Spot';
import Profile from './components/Profile';
import PrivateRoute from './components/PrivateRoute';
import NavBar from './components/Navbar';
import Info from './components/Info';
import Home from './components/Home';
import history from './lib/history';
import ExternalApi from './components/ExternalApi';
import { useAuth0 } from './lib/auth/react-auth0-wrapper';
import { Router, Route, Switch } from 'react-router-dom';
import { RouteNames } from './lib/common/enums';
import { QuestionsIntro } from './components/questionaire/QuestionsIntro';
import { QA } from './components/questionaire/QA-entrypoint';
import { PDFPage } from './components/questionaire/ReportPDF';
import { Page404 } from './components/Page404';

const App: React.FC = () => {
  const { loading } = useAuth0();

  if (loading) {
    return (
      <div className='pageloader is-active'>
        <h1 className='title'>Authentifizere Benutzer mit Auth Server</h1>
      </div>
    );
  }

  return (
    <React.Fragment>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Flusshygiene</title>
      </Helmet>
      <Router history={history}>
        <main>
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
              path={`/${RouteNames.questionnaire}-pdfviewer`}
              component={PDFPage}
            />
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
      <footer className='footer'></footer>
    </React.Fragment>
  );
};

export default App;
