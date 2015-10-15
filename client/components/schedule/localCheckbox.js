import React from "react";
import {FormField, Checkbox} from "elemental";

export default class LocalCheckbox extends React.Component {
  render() {
    const {checked, onChange, disabled} = this.props;
    return (
      <FormField>
        <Checkbox checked={checked} onChange={onChange} disabled={disabled} label="Display times/dates using local timezone"/>
      </FormField>
    );
  }
}
