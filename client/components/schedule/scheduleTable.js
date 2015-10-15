import React from "react";
import {Table, Button, FormInput} from "elemental";
import AppendTimeForm from "./appendTimeForm";
import dateToInputStrings from "../../util/dateToInputStrings";
import extendState from "../../util/extendState";
import TimeInput from "../timeInput";
import DateInput from "../dateInput";

const style = {
  maxHeight: 500,
  overflow: "auto"
};

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

  updateRow(jobToUpdate, newTimestamp) {
    this.props.onChange(this.props.pumpSchedule.map((job) => {
      if(job === jobToUpdate) {
        return {timestamp: newTimestamp};
      }
      return job;
    }))
  }

  removeRow(jobToRemove) {
    this.props.onChange(this.props.pumpSchedule.filter((job) => job !== jobToRemove));
  }

  addRow() {
    this.props.onChange(this.props.pumpSchedule.concat({timestamp: this.state.newTimestamp}));
  }

  render() {
    const {pumpSchedule, disabled, local} = this.props;
    const {newTimestamp} = this.state;
    return (
      <div style={style}>
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
            {disabled ?
              null :
              <AppendTimeForm value={newTimestamp} onChange={this.updateNewTimestamp} onSubmit={this.addRow} local={local}/>
            }
            {pumpSchedule.sort((jobA, jobB) => jobA.timestamp - jobB.timestamp).map((job, i) => {
              const {timestamp} = job;
              return (
                <tr key={`entry-${timestamp}-${i}`}>
                  <td><DateInput local={local} disabled={disabled} value={timestamp} onChange={this.updateRow.bind(this, job)}/></td>
                  <td><TimeInput local={local} disabled={disabled} value={timestamp} onChange={this.updateRow.bind(this, job)}/></td>
                  <td>
                    {disabled ? null :
                      <Button type="danger" disabled={disabled} onClick={this.removeRow.bind(this, job)}>Remove</Button>
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot/>
        </Table>
      </div>
    );
  }
}

ScheduleTable.defaultProps = {
  onChange() {}
};
