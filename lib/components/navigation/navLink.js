import React from "react";
import {Button} from "elemental";

const activeNavProps = {
  type: "link",
  style: {
    textDecoration: "underline",
    color: "#1385e5"
  }
};

const inactiveNavProps = {
  type: "link-text"
};

export default class NavLink extends React.Component {
  render() {
    const {href, hash} = this.props;
    const styleProps = href && (hash === href.replace("#", "")) ? activeNavProps : inactiveNavProps;
    return (<Button {...this.props} {...styleProps}/>)
  }
}