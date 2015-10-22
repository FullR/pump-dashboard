import React from "react";
import {Button} from "elemental";
import request from "superagent";

const style = {
  position: "relative",
  marginBottom: 20
};

const buttonContainerStyle = {
  position: "absolute",
  right: 0,
  top: 0
};

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: null,
      status: null
    };
    this.startPumps = this.startPumps.bind(this);
    this.stopPumps = this.stopPumps.bind(this);
    this.update = this.update.bind(this);
  }

  update() {
    request("GET", "/api/status").end((error, res) => {
      if(error) {
        this.setState({
          loading: false,
          error: error,
          status: null
        });
      } else {
        this.setState({
          loading: false,
          error: null,
          status: res.body
        });
      }
    });
  }

  startPumps() {
    request("POST", "/api/start-pumps").end((error, res) => {
      if(error) {
        console.log("Failed to start pumps:", error);
      }
      this.update();
    });
  }

  stopPumps() {
    request("POST", "/api/stop-pumps").end((error, res) => {
      if(error) {
        console.log("Failed to stop pumps:", error);
      }
      this.update();
    });
  }

  componentDidMount() {
    this._interval = setInterval(this.update, 3000);
    this.update();
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  render() {
    const {loading, error, status} = this.state;
    return (
      <div style={style}>
        <img src={require("../../statics/logo.png")}/>
        <h3>SmartPumps</h3>
        {loading || error ? null :
          <div style={buttonContainerStyle}>
            <p>Pump Status: {status.pumping ? "pumping" : "idle"}</p>
            <Button onClick={this.startPumps}>Start Pump</Button>
            <Button onClick={this.stopPumps}>Stop Pump</Button>
          </div>
        }
      </div>
    );
  }
}
