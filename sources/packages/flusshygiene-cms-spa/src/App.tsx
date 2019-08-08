import React from 'react';
// import logo from './logo.svg';
import NavBar from './components/Navbar';
import Home from './components/Home';
import { useAuth0 } from './react-auth0-wrapper';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Profile from './components/Profile';
import PrivateRoute from './components/PrivateRoute';
import ExternalApi from './components/ExternalApi';
function App() {
  const { loading } = useAuth0();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className='section'>
      <BrowserRouter>
        <header>
          <NavBar />
        </header>
        <Switch>
          <Route path='/' exact component={Home} />
          <PrivateRoute path='/profile' component={Profile} />
          <PrivateRoute path='/external-api' component={ExternalApi} />
        </Switch>
      </BrowserRouter>
    </main>
  );
}

export default App;
