import React from "react";
import {Provider} from "react-redux";
import {Router, Route, IndexRoute, hashHistory} from "react-router";
import {syncHistoryWithStore} from "react-router-redux";
import store from "store";

import LoginForm from "containers/login-form";

const history = syncHistoryWithStore(hashHistory, store);

export default function AppRouter() {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Route path="/login" component={LoginForm}/>
        <Route path="/counter" component={LoginForm}/>
        <Route path="*" component={LoginForm}/>
      </Router>
    </Provider>
  );
}
