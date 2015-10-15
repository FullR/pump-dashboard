import React from "react";
import {FormRow, FormField, FormInput} from "elemental";
import clamp from "../../util/clamp";

export default class IpInput extends React.Component {
  onDigitChange(index, event) {
    const newDigit = clamp(0, 256, parseInt(event.target.value));
    if(newDigit !== this.props.value[index]) {
      const newValue = this.props.value.slice();
      newValue[index] = newDigit;
      this.props.onChange(newValue);
    }
  }

  render() {
    const {disabled, readOnly} = this.props;
    const value = this.props.value || [0, 0, 0, 0];
    return (
      <FormField label={this.props.label}>
        <FormRow>
          <FormField width="one-quarter">
            <FormInput
              type="number"
              pattern="[0-9]*"
              disabled={disabled}
              value={value[0]}
              onChange={(event) => this.onDigitChange(0, event)}/>
          </FormField>
          <FormField width="one-quarter">
            <FormInput
              type="number"
              pattern="[0-9]*"
              disabled={disabled}
              value={value[1]}
              onChange={(event) => this.onDigitChange(1, event)}/>
          </FormField>
          <FormField width="one-quarter">
            <FormInput
              type="number"
              pattern="[0-9]*"
              disabled={disabled}
              value={value[2]}
              onChange={(event) => this.onDigitChange(2, event)}/>
          </FormField>
          <FormField width="one-quarter">
            <FormInput
              type="number"
              pattern="[0-9]*"
              disabled={disabled}
              value={value[3]}
              onChange={(event) => this.onDigitChange(3, event)}/>
          </FormField>
        </FormRow>
      </FormField>
    );
  }
}

IpInput.defaultProps = {
  value: [0, 0, 0, 0],
  onChange() {}
}
