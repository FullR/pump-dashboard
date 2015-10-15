import React from "react";
import {FormInput} from "elemental";
import dateToInputString from "../util/dateToInputStrings";
import dateFromInputString from "../util/dateFromInputStrings";

export default class TimeInput extends React.Component {
  onChange(dateString, newTimeString) {
    const {onChange, local} = this.props;
    if(onChange) {
      onChange(dateFromInputString(dateString, newTimeString, local).getTime());
    }
  }

  render() {
    const {value, local} = this.props;
    const {timeString, dateString} = value ? dateToInputString(new Date(value), local) : {timeString: "", dateString: ""};
    return (<FormInput {...this.props} type="time" value={timeString} onChange={(event) => this.onChange(dateString, event.target.value)}/>);
  }
}
