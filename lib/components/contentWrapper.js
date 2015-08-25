import React from "react";
import Header from "./header";
import Navigation from "./navigation";
import Footer from "./footer";

export default class ContentWrapper extends React.Component {
  render() {
    return (
      <div>
        <Header/>
        <Navigation/>
        <div style={{padding: "20px 0 20px 0"}}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
