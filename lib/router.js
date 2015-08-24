import React from "react";
import Dashboard from "./components/dashboard";
import Logs from "./components/logs";
import Schedule from "./components/schedule";
import Settings from "./components/settings";

export default class Router extends React.Component {
  render() {
    switch(this.props.hash) {
      case "dashboard": return <Dashboard/>;
      case "logs": return <Logs/>;
      case "schedule": return <Schedule/>;
      case "settings": return <Settings/>;
      default: return <Dashboard/>;
    }
  }
}
