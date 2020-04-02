import React from "react";
import { Helmet } from "react-helmet";

import Spot from "./components/Spot";
import Profile from "./components/Profile";
import PrivateRoute from "./components/PrivateRoute";
import NavBar from "./components/Navbar";
import Info from "./components/Info";
import Home from "./components/Home";
import history from "./lib/history";
// import ExternalApi from './components/ExternalApi';
import { useAuth0 } from "./lib/auth/react-auth0-wrapper";
import { Router, Route, Switch, Link } from "react-router-dom";
import { RouteNames } from "./lib/common/enums";
import { QuestionsIntro } from "./components/questionaire/QuestionsIntro";
import { QA } from "./components/questionaire/QA-entrypoint";
import { PDFPage } from "./components/questionaire/ReportPDF";
import { Page404 } from "./components/Page404";
import { Imprint } from "./components/imprint";
import { HelpDesk } from "./components/HelpDesk";

const App: React.FC = () => {
  const { loading } = useAuth0();

  if (loading) {
    return (
      <div className="pageloader is-active">
        <h1 className="title">Authentifizere Benutzer mit Auth Server</h1>
      </div>
    );
  }

  return (
    <React.Fragment>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Flusshygiene</title>
      </Helmet>
      <Router history={history}>
        <main id="wrapper">
          <header>
            <NavBar />
          </header>
          <Switch>
            {/* https://tylermcginnis.com/react-router-pass-props-to-components/ */}
            <Route path="/" exact component={Home} />
            <PrivateRoute
              path={`/${RouteNames.bathingspot}/:id`}
              component={Spot}
            />
            <Route path="/info" component={Info} />
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
            <PrivateRoute path={`/${RouteNames.profile}`} component={Profile} />
            <PrivateRoute
              path={`/${RouteNames.helpdesk}`}
              component={HelpDesk}
            />
            {/* <PrivateRoute path='/external-api' component={ExternalApi} /> */}
            <Route
              path={`/${RouteNames.imprint}`}
              render={(props) => <Imprint {...props} imprintType="imprint" />}
            />
            <Route
              path={`/${RouteNames.privacy}`}
              render={(props) => <Imprint {...props} imprintType="privacy" />}
            />
            <Route component={Page404} />
          </Switch>
        </main>
        <footer className="footer">
          <div className="content">
            <p style={{ color: "white" }}>
              <Link
                style={{ color: "white", textDecoration: "underline" }}
                to={`/${RouteNames.imprint}`}
              >
                Impressum
              </Link>
              {" || "}
              <Link
                style={{ color: "white", textDecoration: "underline" }}
                to={`/${RouteNames.privacy}`}
              >
                Datenschutz
              </Link>
            </p>
          </div>
        </footer>
      </Router>
    </React.Fragment>
  );
};

export default App;
