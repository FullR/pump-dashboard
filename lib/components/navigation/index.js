import React from "react";
import {Button} from "elemental";

const logoutButtonStyle = {
  position: "absolute",
  right: 0
};

export default class Navigation extends React.Component {
  render() {
    return (
      <div style={{position: "relative"}}>
        <Button size="lg" href="#dashboard" type="link-text">Dashboard</Button>
        <Button size="lg" href="#schedule" type="link-text">Schedule</Button>
        <Button size="lg" href="#settings" type="link-text">Settings</Button>
        <Button size="lg" href="#logs" type="link-text">Logs</Button>
        <Button type="link-text" style={logoutButtonStyle} onClick={this.props.logout}>Logout</Button>
      </div>
    );
  }
}
