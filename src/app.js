import "babel-polyfill";
import "index.html";
import ReactDOM from "react-dom";
import React from "react";
import Application from "./components/application";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();
window.noop = function() {};

function App() {
  return (
    <MuiThemeProvider>
      <Application/>
    </MuiThemeProvider>
  );
}

ReactDOM.render(<App/>, document.querySelector("#app-container"));
