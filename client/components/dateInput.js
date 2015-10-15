import React from "react";
import {FormInput} from "elemental";
import dateToInputString from "../util/dateToInputStrings";
import dateFromInputString from "../util/dateFromInputStrings";

export default class DateInput extends React.Component {
  onChange(newDateString, timeString) {
    const {onChange, local} = this.props;
    if(onChange) {
      onChange(dateFromInputString(newDateString, timeString, local).getTime());
    }
  }

  render() {
    const {value, local} = this.props;
    const {timeString, dateString} = value ? dateToInputString(new Date(value), local) : {timeString: "", dateString: ""};
    return (<FormInput {...this.props} type="date" value={dateString} onChange={(event) => this.onChange(event.target.value, timeString)}/>);
  }
}
