import "babel-polyfill";
import "index.html";
import ReactDOM from "react-dom";
import React from "react";
import Router from "router";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();
window.noop = function() {};

function App() {
  return (
    <MuiThemeProvider>
      <Router/>
    </MuiThemeProvider>
  );
}

ReactDOM.render(<App/>, document.querySelector("#app-container"));
