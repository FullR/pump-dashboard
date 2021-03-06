import React from "react";
import {Observable} from "rx";
import {noop} from "lodash";
import request from "superagent";
import requestObservable from "../../util/requestObservable";
import stateUpdater from "../../util/stateUpdater";
import getEventValue from "../../util/getEventValue";
import extendState from "../../util/extendState";
import bindEach from "../../util/bindEach";
import SpinnerButton from "../spinnerButton";
import {Form, FormField, FormInput, Alert} from "elemental";

const TESTDATA = {
  username: "admin",
  password: "foobar"
};

const width = 600;
const style = {
  height: "100%"
};

const formStyle = {
  width,
  position: "relative",
  left: "50%",
  top: "40%",
  marginLeft: -(width/2),
  transform: "translateY(-50%)"
};

function authenticate(username, password) {
  return requestObservable(request("POST", "/api/login").type("json").send({username, password}));
}

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      error: null,
      pending: false
    };
    bindEach(this, "submit", "onAuthFail", "onAuthSuccess");
    this.updateUsername = stateUpdater(this, "username", getEventValue);
    this.updatePassword = stateUpdater(this, "password", getEventValue);
  }

  onAuthFail(error) {
    console.log(error);
    extendState(this, {
      error,
      pending: false,
      username: "",
      password: ""
    });
  }

  onAuthSuccess(user) {
    this.props.onSuccess(user);
  }

  submit(event) {
    const username = this.state.username.trim();
    const password = this.state.password;
    if(event && event.preventDefault) event.preventDefault();

    if(!username.length) {
      extendState(this, {
        error: new Error("Username is required")
      });
    } else if(!password.length) {
      extendState(this, {
        error: new Error("Password is required")
      });
    } else {
      extendState(this, {pending: true});
      authenticate(username, password).subscribe(noop, this.onAuthFail, this.onAuthSuccess);
    }
  }

  render() {
    const {username, password, error, pending} = this.state;
    const {updateUsername, updatePassword} = this;

    return (
      <div style={style}>
        <Form onSubmit={this.submit} style={formStyle}>
          {error ? 
            <Alert type="warning">{error.message}</Alert> :
            null
          }
          <FormField label="Username" htmlFor="username">
            <FormInput
              value={username}
              onChange={updateUsername}
              disabled={pending}
              focusOnMount={true}
              type="text"
              placeholder="Username"
              name="username"/>
          </FormField>
          <FormField label="Password" htmlFor="password">
            <FormInput
              value={password}
              onChange={updatePassword}
              disabled={pending}
              type="password"
              placeholder="Password"
              name="password"/>
          </FormField>
          <SpinnerButton
            type="primary"
            pending={pending}
            submit={true}>
            Login
          </SpinnerButton>
        </Form>
      </div>
    );
  }
}

Login.defaultProps = {
  onSuccess() {}
};
