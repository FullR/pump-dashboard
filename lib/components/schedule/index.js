import React from "react";
import AsyncButton from "../asyncButton";
import {Form, FormField, FormNote, FormInput, Table, Label, Checkbox} from "elemental";
import {range} from "lodash";

const tableStyle = {
  maxHeight: 800,
  overflow: "auto",
  marginBottom: 30
};

export default class Schedule extends React.Component {
  render() {
    return (
      <div>
        <Form>
          <FormField htmlFor="manual">
            <Checkbox label="Manual Mode" name="manual"/>
            <FormNote>When manual mode is enabled, the scheduled pump times below can be modified and the system will not request new times from NOAA.</FormNote>
          </FormField>
          <div style={tableStyle}>
            <Table>
              <colgroup>
                <col width="30"/>
                <col width="40%"/>
                <col width="40%"/>
              </colgroup>

              <thead>
                <tr>
                  <th>Remove</th>
                  <th>Time</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody style={tableStyle}>
                {range(60).map((i) => 
                  <tr key={`entry-${i}`}>
                    <td><Checkbox/></td>
                    <td><input type="time"/></td>
                    <td><input type="date"/></td>
                  </tr>
                )}
              </tbody>
              <tfoot></tfoot>
            </Table>
          </div>
          <AsyncButton>Submit</AsyncButton>
        </Form>
      </div>
    );
  }
}
