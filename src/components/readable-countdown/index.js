import React, {PropTypes} from "react";
import formatTimeInterval from "../../../server/util/format-time-interval";

function getTime(date) {
  if(!date) return 0;
  switch(typeof date) {
    case "number": return date;
    case "object": return date.getTime();
    case "string": return new Date(date).getTime();
  }
}

export default class ReadableCountdown extends React.Component {
  componentDidMount() {
    this.interval = setInterval(this.forceUpdate.bind(this), 500);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const {date, ...rest} = this.props;
    const now = Date.now();
    const remaining = getTime(date) - now;

    return (
      <span {...rest}>
        {formatTimeInterval(remaining)}
      </span>
    );
  }
}
