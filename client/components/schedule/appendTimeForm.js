import React from "react";
import {Form, FormField, FormInput, Button} from "elemental";
import dateToInputStrings from "../../util/dateToInputStrings";
import dateFromInputStrings from "../../util/dateFromInputStrings";
import TimeInput from "../timeInput";
import DateInput from "../dateInput";

export default class AppendTimeForm extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(newValue) {
    if(this.props.onChange) this.props.onChange(newValue);
  }

  render() {
    const {value, disabled, local} = this.props;

    return (
      <tr>
        <td>
          <FormField label="Schedule a new pump cycle">
            <DateInput value={value} local={local} onChange={this.onChange}/>
          </FormField>
        </td>
        <td>
          <FormField label="&nbsp;">
            <TimeInput value={value} local={local} onChange={this.onChange}/>
          </FormField>
        </td>
        <td><Button type="primary" disabled={disabled} onClick={this.props.onSubmit}>Add</Button></td>
      </tr>
    );
  }
}

AppendTimeForm.defaultProps = {
  value: 0
};
