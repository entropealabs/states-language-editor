import React from 'react';
import Homepage from './Homepage.js';
import { Switch, Route, Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

const App = () => (
  <div className="App">
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={Homepage} />
      </Switch>
    </Router>
  </div>
);

export default App;
