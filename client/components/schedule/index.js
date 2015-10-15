import React from "react";
import SpinnerButton from "../spinnerButton";
import Loader from "react-loader";
import {Form, FormField, FormNote, FormInput, Table, Label, Checkbox, Alert} from "elemental";
import {range, cloneDeep, extend} from "lodash";
import request from "superagent";
import requestObservable from "../../util/requestObservable";
import bindEach from "../../util/bindEach";

import ManualCheckbox from "./manualCheckbox";
import LocalCheckbox from "./localCheckbox";
import ScheduleTable from "./scheduleTable";
import AppendTimeForm from "./appendTimeForm";
import Countdown from "./countdown";

let cachedSchedule = null;

const tableStyle = {
  maxHeight: 800,
  overflow: "auto",
  marginBottom: 30
};

const submitButtonStyle = {
  marginTop: 20
};

function requestSchedule() {
  return requestObservable(request("GET", "/api/schedule")).map((res) => res.body);
}

export default class Schedule extends React.Component {
  constructor(props) {
    super(props);
    bindEach(this, "toggleManual", "toggleLocal", "updatePumpSchedule", "submit");

    if(cachedSchedule) {
      this.state = {
        error: null,
        loading: true,
        local: true,
        schedule: {
          manual: cachedSchedule.manual,
          manualSchedule: cachedSchedule.manualSchedule.slice(),
          automaticSchedule: cachedSchedule.automaticSchedule.slice()
        }
      };
    } else {
      this.state = {
        error: null,
        loading: true,
        local: true,
        schedule: {
          manual: false,
          manualSchedule: [],
          automaticSchedule: []
        }
      };
    }
  }

  getNearestTimestamp() {
    const {originalSchedule} = this.state;
    if(!originalSchedule) {
      return null;
    };
    const timestamps = originalSchedule.manual ? originalSchedule.manualSchedule : originalSchedule.automaticSchedule;
    const now = Date.now();
    if(!timestamps.length) {
      return null;
    }

    return timestamps.filter((t) => t >= now).reduce((a, b) => Math.min(a, b));
  }

  componentDidMount() {
    requestSchedule().subscribe(
      (schedule) => {
        cachedSchedule = cloneDeep(schedule);
        this.setState({
          schedule,
          originalSchedule: cloneDeep(schedule),
          error: null,
          loading: false
        });
      },
      (error) => {
        this.setState({
          error,
          loading: false
        });
      }
    );
  }

  toggleManual() {
    const {originalSchedule} = this.state;
    this.setState({
      schedule: extend(cloneDeep(originalSchedule), {manual: !this.state.schedule.manual})
    });
  }

  toggleLocal() {
    this.setState({
      local: !this.state.local
    });
  }

  updatePumpSchedule(newPumpSchedule) {
    const {manual, schedule} = this.state.schedule;
    this.setState({
      schedule: extend({}, schedule, {
        manual,
        [manual ? "manualSchedule" : "automaticSchedule"]: newPumpSchedule
      })
    });
  }

  submit() {
    const {schedule} = this.state;
    const {manual} = schedule;
    if(!manual) return;

    requestObservable(request("POST", "/api/schedule").send(this.state.schedule))
      .take(1)
      .subscribe(() => {}, (error) => {
        this.setState({error});
      });
  }

  render() {
    const {error, loading, schedule, local} = this.state;
    const {manual, manualSchedule, automaticSchedule} = schedule;
    const currentSchedule = manual ? (manualSchedule || []) : (automaticSchedule || []);
    const formDisabled = loading || error;

    return (
      <div>
        {error ? <Alert type="danger"><strong>Error: </strong>{error.message}</Alert> : null}
        <Countdown timestamp={this.getNearestTimestamp()}><strong>Time until next pump: </strong></Countdown>
        <LocalCheckbox checked={local} onChange={this.toggleLocal} disabled={formDisabled}/>
        <ManualCheckbox checked={manual} onChange={this.toggleManual} disabled={formDisabled}/>
        <ScheduleTable pumpSchedule={currentSchedule} disabled={formDisabled || !manual} local={local} onChange={(v) => this.updatePumpSchedule(v)}/>
        <SpinnerButton disabled={formDisabled} onClick={this.submit} style={submitButtonStyle}>Submit</SpinnerButton>
      </div>
    );
  }
}
