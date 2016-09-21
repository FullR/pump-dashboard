import React, {PropTypes} from "react";
import request from "superagent";
import cx from "./style.css";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";

export default class LoginForm extends React.Component {
  static defaultProps = {onSubmit: window.noop};
  state = {username: "admin", password: "OIMB45"};
  handleUsernameChange = (e, v) => this.setState({username: v});
  handlePasswordChange = (e, v) => this.setState({password: v});
  handleSubmit = (e) => {
    if(e && e.preventDefault) e.preventDefault();
    this.props.onSubmit(this.state);
  };

  // startPump = () => {
  //   request.post("/api/start-pump")
  //     .end((error, response) => console.log(error || response));
  // };
  //
  // stopPump = () => {
  //   request.post("/api/stop-pump")
  //     .end((error, response) => console.log(error || response))
  // };
  //
  // getPumpTimes() {
  //   request.get("/api/pump-times")
  //     .end((error, response) => {
  //       if(error) {
  //         console.log(error);
  //       } else {
  //         console.log(response);
  //         this.setState({pumpTimes: response.body});
  //       }
  //     });
  // }

  render() {
    const {error, children, className} = this.props;
    const {username, password, pumpTimes} = this.state;
    const classNames = cx(className, "root");

    return (
      <div className={classNames}>
        <form onSubmit={this.handleSubmit}>
          <TextField id="username" name="username" value={username} onChange={this.handleUsernameChange}/>
          <TextField id="password" name="password" value={password} onChange={this.handlePasswordChange}/>
          <RaisedButton onClick={this.handleSubmit}>Login</RaisedButton>
        </form>
      </div>
    );
  }
}

LoginForm.propTypes = {};
LoginForm.defaultProps = {};
