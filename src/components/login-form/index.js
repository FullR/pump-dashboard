import React, {PropTypes} from "react";
import request from "superagent";
import cx from "./style.css";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";

export default class LoginForm extends React.Component {
  static defaultProps = {onSubmit: window.noop};
  state = {username: "admin", password: "password", pumpTimes: []};
  handleUsernameChange = (e, v) => this.setState({username: v});
  handlePasswordChange = (e, v) => this.setState({password: v});
  handleSubmit = (e) => {
    if(e && e.preventDefault) e.preventDefault();
    this.props.onSubmit(this.state);
  };

  startPump = () => {
    request.post("/api/start-pump")
      .end((error, response) => console.log(error || response));
  };

  stopPump = () => {
    request.post("/api/stop-pump")
      .end((error, response) => console.log(error || response))
  };

  getPumpTimes() {
    request.get("/api/pump-times")
      .end((error, response) => {
        if(error) {
          console.log(error);
        } else {
          console.log(response);
          this.setState({pumpTimes: response.body});
        }
      });
  }

  componentDidUpdate(lastProps) {
    if(this.props.user && !lastProps.user) {
      this.getPumpTimes();
    }
  }

  render() {
    const {user, error, children, className} = this.props;
    const {username, password, pumpTimes} = this.state;
    const classNames = cx(className, "root");

    return (
      <div className={classNames}>
        {user ?
          <h1>{user.username}</h1> :
          null
        }
        {error ?
          <h1>{error.toString()}</h1> :
          null
        }
        <form onSubmit={this.handleSubmit}>
          <TextField id="username" name="username" value={username} onChange={this.handleUsernameChange}/>
          <TextField id="password" name="password" value={password} onChange={this.handlePasswordChange}/>
          <RaisedButton onClick={this.handleSubmit}>Login</RaisedButton>
        </form>

        <ul>
          {pumpTimes.map((entry) =>
            <li key={entry.id}>{entry.pumpTime.toString()}</li>
          )}
        </ul>

        {user ?
          <div>
            <button onClick={this.startPump}>Start Pumps</button>
            <button onClick={this.stopPump}>Stop Pumps</button>
          </div> :
          null
        }
      </div>
    );
  }
}

LoginForm.propTypes = {};
LoginForm.defaultProps = {};
