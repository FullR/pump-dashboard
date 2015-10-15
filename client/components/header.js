import React from "react";

const style = {
  marginBottom: 20
};

export default class Header extends React.Component {
  render() {
    return (
      <div style={style}>
        <img src={require("../../statics/logo.png")}/>
        <h3>SmartPumps</h3>
      </div>
    );
  }
}
