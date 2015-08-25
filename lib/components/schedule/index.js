import React from "react";
import AsyncButton from "../asyncButton";
import {Form, FormField, FormNote, FormInput, Table, Label, Checkbox, Alert} from "elemental";
import {range} from "lodash";
import request from "superagent";
import requestObservable from "../../util/requestObservable";
import extendState from "../../util/extendState";
import bindEach from "../../util/bindEach";

import ManualCheckbox from "./manualCheckbox";
import LocalCheckbox from "./localCheckbox";
import ScheduleTable from "./scheduleTable";
import AppendTimeForm from "./appendTimeForm";

const tableStyle = {
  maxHeight: 800,
  overflow: "auto",
  marginBottom: 30
};

function requestSchedule() {
  return requestObservable(request("GET", "/api/schedule")).map((res) => res.body);
}

export default class Schedule extends React.Component {
  constructor(props) {
    super(props);
    bindEach(this, "toggleManual", "toggleLocal", "updatePumpSchedule");
    this.state = {
      error: null,
      loading: true,
      local: true,
      originalPumpSchedule: [],
      schedule: {
        manual: false,
        pumpSchedule: []
      }
    };
  }

  componentDidMount() {
    requestSchedule().subscribe(
      (schedule) => {
        extendState(this, {
          schedule,
          originalPumpSchedule: schedule.pumpSchedule.slice(), // keep a copy in case the user changes to manual mode and makes changes
          error: null,
          loading: false
        });
      },
      (error) => {
        extendState(this, {
          error,
          loading: false
        });
      }
    );
  }

  toggleManual() {
    if(this.state.schedule.manual) {
      extendState(this, {
        schedule: {
          manual: false,
          pumpSchedule: this.state.originalPumpSchedule.slice()
        }
      });
    } else {
      extendState(this, {
        schedule: {
          manual: true,
          pumpSchedule: this.state.schedule.pumpSchedule
        }
      });
    }
  }

  toggleLocal() {
    extendState(this, {
      local: !this.state.local
    });
  }

  updatePumpSchedule(newPumpSchedule) {
    extendState(this, {
      schedule: {
        manual: this.state.schedule.manual,
        pumpSchedule: newPumpSchedule
      }
    });
  }

  render() {
    const {error, loading, schedule, originalPumpSchedule, local} = this.state;
    const {manual, pumpSchedule} = schedule;
    const formDisabled = loading || error;

    return (
      <div>
        {error ? <Alert type="danger"><strong>Error: </strong>{error.message}</Alert> : null}
        <LocalCheckbox checked={local} onChange={this.toggleLocal} disabled={formDisabled}/>
        <ManualCheckbox checked={manual} onChange={this.toggleManual} disabled={formDisabled}/>
        <ScheduleTable pumpSchedule={pumpSchedule} disabled={formDisabled || !manual} local={local} onChange={(v) => this.updatePumpSchedule(v)}/>
        <AsyncButton disabled={formDisabled}>Submit</AsyncButton>
      </div>
    );
  }
}
