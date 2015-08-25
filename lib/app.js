import "babel-core/polyfill";
import React from "react";
import hasher from "hasher";
import Footer from "./components/footer";
import {Button} from "elemental";
import Router from "./router";
import ContentWrapper from "./components/contentWrapper";
import Login from "./components/login";
import extendState from "./util/extendState";
import request from "superagent";

require("./style/base.scss");
require("../node_modules/elemental/less/elemental.less");

const style = {
  padding: 30
};

class Application extends React.Component {
  constructor(props) {
    super(props);
    hasher.init();
    this.logout = this.logout.bind(this);
    this.state = {
      hash: hasher.getHash(),
      authenticated: !!window.USER
    };
  }

  componentDidMount() {
    hasher.changed.add(() => extendState(this, {hash: hasher.getHash()}));
  }

  logout() {
    request("GET", "/api/logout").end((err) => {
      if(err) {
        console.log("Failed to logout:",err);
      } else {
        console.log("Logged out successfully");
      }
    });
    extendState(this, {authenticated: false});
  }

  onLogin() {
    extendState(this, {authenticated: true});
  }

  render() {
    if(!this.state.authenticated) {
      return (
        <div className="container">
          <Login onSuccess={this.onLogin.bind(this)}/>
        </div>
      );
    }
    return (
      <div className="container" style={style}>
        <ContentWrapper logout={this.logout}>
          <Router hash={this.state.hash}/>
        </ContentWrapper>
      </div>
    );
  }
}

React.render(<Application/>, document.body);
