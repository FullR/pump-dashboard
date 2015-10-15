import React from "react";

function pad(s) {
  const str = ""+s;
  return str.length < 2 ? `0${str}` : str;
}
function formatMs(ms) {
  const {floor} = Math;
  const totalSeconds = floor(ms / 1000);
  const hours = floor(ms / (60 * 60 * 1000));
  const minutes = floor(ms / (60 * 1000)) % 60;
  const seconds = totalSeconds % 60;

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export default class Countdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      remaining: this.getRemaining()
    };
  }

  getRemaining() {
    const remaining = this.props.timestamp - Date.now();
    if(remaining < 0) return this.props.errorText;
    return formatMs(remaining);
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({remaining: this.getRemaining()});
    }, this.props.interval);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (<div>{this.props.children}{this.state.remaining}</div>)
  }
}

Countdown.defaultProps = {
  interval: 250,
  errorText: ""
};
