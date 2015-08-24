import "babel-core/polyfill";
//import React from "elemental/node_modules/react/addons";
import React from "react";
import hasher from "hasher";
import Footer from "./components/footer";
import {Button} from "elemental";
import Router from "./router";
import ContentWrapper from "./components/contentWrapper";
import Login from "./components/login";
import extendState from "./util/extendState";

require("./style/base.scss");
require("../node_modules/elemental/less/elemental.less");
require("file?name=index.html!../statics/index.html");

const style = {
  padding: 30
};

class Application extends React.Component {
  constructor(props) {
    super(props);
    hasher.init();
    this.state = {
      hash: hasher.getHash(),
      authenticated: false
    };
  }

  componentDidMount() {
    hasher.changed.add(() => extendState(this, {hash: hasher.getHash()}));
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
        <ContentWrapper>
          <Router hash={this.state.hash}/>
        </ContentWrapper>
      </div>
    );
  }
}

React.render(<Application/>, document.body);
