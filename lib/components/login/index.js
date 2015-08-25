import React from "react";
import {Observable} from "rx";
import {noop} from "lodash";
import stateUpdater from "../../util/stateUpdater";
import getEventValue from "../../util/getEventValue";
import extendState from "../../util/extendState";
import bindEach from "../../util/bindEach";
import AsyncButton from "../asyncButton";
import {Form, FormField, FormInput, Alert} from "elemental";

const TESTDATA = {
  username: "admin",
  password: "foobar"
};

const width = 600;
const height = 600;
const style = {
  width, height,
  position: "absolute",
  left: "50%",
  top: 150,
  marginLeft: -(width/2)
};

function authenticate(username, password) {
  return Observable.create((observer) => {
    let finished = false;
    const timeout = setTimeout(() => {
      finished = true;
      if(TESTDATA.username === username && TESTDATA.password === password) {
        observer.onCompleted();
      } else {
        observer.onError(new Error("Invalid username or password"));
      }
    }, 300);

    return () => {
      if(!finished) {
        console.log("Cancelling authentication");
        clearTimeout(timeout);
      }
    };
  });
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
        <Form onSubmit={this.submit}>
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
          <AsyncButton
            type="default"
            pending={pending}
            submit={true}>
            Submit
          </AsyncButton>
        </Form>
      </div>
    );
  }
}

Login.defaultProps = {
  onSuccess() {}
};
