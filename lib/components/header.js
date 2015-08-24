import React from "react";

export default class Header extends React.Component {
  render() {
    return (
      <div className="header">
        <img src={require("../../statics/logo.png")}/>
      </div>
    );
  }
}
