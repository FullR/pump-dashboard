import {EventEmitter} from "events";

export default class ScheduleManager extends EventEmitter {
  constructor({manualSchedule=[], automaticSchedule=[], manual=false}={}) {
    super();
    this.automaticSchedule = automaticSchedule;
    this.manualSchedule = manualSchedule;
    this.manual = manual;
  }

  get json() {
    const {automaticSchedule, manualSchedule, manual} = this;
    return JSON.stringify({automaticSchedule, manualSchedule, manual}, null, 2);
  }

  get currentSchedule() {
    return this.manual ? this.manualSchedule : this.automaticSchedule;
  }

  _change() {
    this.emit("change", this);
  }

  enableManual() {
    this.manual = true;
    this._change();
  }

  disableManual() {
    this.manual = false;
    this._change();
  }

  setManualSchedule(newManualSchedule=[]) {
    this.manualSchedule = newManualSchedule;
    this._change();
  }

  setAutomaticSchedule(newAutomaticSchedule=[]) {
    this.automaticSchedule = newAutomaticSchedule;
    this._change();
  }
}
