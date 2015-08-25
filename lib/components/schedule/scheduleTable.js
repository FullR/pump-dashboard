import React from "react";
import {Table, Button, FormInput} from "elemental";
import AppendTimeForm from "./appendTimeForm";
import dateToInputStrings from "../../util/dateToInputStrings";
import extendState from "../../util/extendState";
import TimeInput from "../timeInput";
import DateInput from "../dateInput";

export default class ScheduleTable extends React.Component {
  constructor(props) {
    super(props);
    this.updateNewTimestamp = this.updateNewTimestamp.bind(this);
    this.addRow = this.addRow.bind(this);
    this.state = {
      newTimestamp: null,
      local: true
    };
  }

  updateNewTimestamp(newTimestamp) {
    extendState(this, {newTimestamp});
  }

  removeRow(index) {
    this.props.onChange(this.props.pumpSchedule.filter((v, i) => i !== index));
  }

  addRow() {
    this.props.onChange(this.props.pumpSchedule.concat({timestamp: this.state.newTimestamp}));
  }

  render() {
    const {pumpSchedule, disabled, local} = this.props;
    const {newTimestamp} = this.state;
    return (
      <div>
        <Table>
          <colgroup>
            <col width="40%"/>
            <col width="40%"/>
            <col width="100"/>
          </colgroup>

          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pumpSchedule.map(({timestamp}, i) => {
              return (
                <tr key={`entry-${timestamp}-${i}`}>
                  <td><DateInput local={local} disabled={disabled} value={timestamp}/></td>
                  <td><TimeInput local={local} disabled={disabled} value={timestamp}/></td>
                  <td>
                    {disabled ? null :
                      <Button type="danger" disabled={disabled} onClick={this.removeRow.bind(this, i)}>Remove</Button>
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
          {disabled ?
            null :
            <AppendTimeForm value={newTimestamp} onChange={this.updateNewTimestamp} onSubmit={this.addRow} local={local}/>
          }
          <tfoot/>
        </Table>
      </div>
    );
  }
}

ScheduleTable.defaultProps = {
  onChange() {}
};
