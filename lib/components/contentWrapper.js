import React from "react";
import Header from "./header";
import Navigation from "./navigation";
import Footer from "./footer";

export default class ContentWrapper extends React.Component {
  render() {
    return (
      <div className="wrapper">
        <Header/>
        <Navigation/>
        <div>
          {this.props.children}
        </div>
        <div className="push"/>
      </div>
    );
  }
}
