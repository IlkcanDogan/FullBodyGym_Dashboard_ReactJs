import React from 'react';
import { BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import PrivateRoute from './core/privateRoute';
import PublicRoute from './core/publicRoute';
import Pages from './pages';


function App() {
  return (
    <Router basename='/coach' >
      <Switch>
        {Pages.public.map((page, index) => { return (<PublicRoute key={index} exact {...page} />) })}
        {Pages.private.map((page, index) => { return (<PrivateRoute key={index} exact {...page} />) })}
        <Redirect to="/" />
      </Switch>
    </Router>
  );
}
export default App;