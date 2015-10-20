import {EventEmitter} from "events";

export default class Scheduler extends EventEmitter {
  constructor(times=[]) {
    super();
    this.times = times;
  }

  get nextTime() {
    const now = Date.now();
    const validTimes = this.times.filter((t) => t > now);
    if(!validTimes.length) {
      return null;
    }
    return validTimes.reduce((a, b) => Math.min(a, b));
  }

  get remaining() {
    return this.nextTime - Date.now();
  }

  scheduleNext() {
    const {nextTime} = this;
    const now = Date.now();
    this.stop();
    if(!nextTime) {
      this.emit("empty");
    } else {
      this._timeout = setTimeout(() => {
        this.emit("interval", nextTime);
        this.scheduleNext();
      }, nextTime - now);
    }

    return this;
  }

  stop() {
    clearTimeout(this._timeout);
  }
}
