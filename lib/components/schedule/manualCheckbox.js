import React from "react";
import {FormField, Checkbox, FormNote} from "elemental";

export default class ManualCheckbox extends React.Component {
  render() {
    const {checked, onChange, disabled} = this.props;
    return (
      <FormField htmlFor="manual">
        <Checkbox label="Manual Mode" name="manual" checked={checked} onChange={onChange} disabled={disabled}/>
        <FormNote>When manual mode is enabled, the scheduled pump times below can be modified and the system will not request new times from NOAA.</FormNote>
      </FormField>
    );
  }
}
