import React from "react";
import {Button} from "elemental";
import NavLink from "./navLink";

const logoutButtonStyle = {
  position: "absolute",
  right: 0
};

export default class Navigation extends React.Component {
  render() {
    const {hash} = this.props;

    return (
      <div style={{position: "relative"}}>
        <NavLink size="lg" hash={hash} href="#dashboard">Dashboard</NavLink>
        <NavLink size="lg" hash={hash} href="#schedule">Schedule</NavLink>
        <NavLink size="lg" hash={hash} href="#settings">Settings</NavLink>
        <NavLink size="lg" hash={hash} href="#logs">Logs</NavLink>
        <Button type="link" style={logoutButtonStyle} onClick={this.props.logout}>Logout</Button>
      </div>
    );
  }
}
