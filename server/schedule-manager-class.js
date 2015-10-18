import {EventEmitter} from "events";

export default class ScheduleManager extends EventEmitter {
  constructor({manualSchedule=[], automaticSchedule=[], manual=false}={}) {
    super();
    this.automaticSchedule = automaticSchedule;
    this.manualSchedule = manualSchedule;
    this.manual = manual;
  }

  get model() {
    const {automaticSchedule, manualSchedule, manual} = this;
    return {automaticSchedule, manualSchedule, manual};
  }

  get json() {
    return JSON.stringify(this.model, null, 2);
  }

  get currentSchedule() {
    return this.manual ? this.manualSchedule : this.automaticSchedule;
  }

  _change() {
    this.emit("change", this);
  }

  enableManual(newManualSchedule) {
    this.manual = true;
    if(newManualSchedule) {
      this.manualSchedule = newManualSchedule;
    }
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
