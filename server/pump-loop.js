const co = require("co");
const lt = require("long-timeout");
const log = require("./log");
const fatal = require("./fatal");
const getNextPumpTime = require("./get-next-pump-time");
const formatTimeInterval = require("./util/format-time-interval");
const pumpManager = require("./pump-manager");
const config = require("./config");

const wait = require("./util/wait");
const {HOUR} = require("./time-constants");
const never = new Promise(() => {}); // never resolves/rejects

let currentPumpJob = null;
let waitingForManualTimes = false;

class PumpJob {
  constructor(pumpTime) {
    this.pumpTime = pumpTime;
    this.pumpTimeout = null;
  }

  schedule() {
    return new Promise((resolve, reject) => {
      const {pumpTime} = this;
      const now = Date.now();
      const remaining = pumpTime.getTime() - now;
      log.info(`Scheduling next pump job for ${pumpTime} (${formatTimeInterval(remaining)} remaining)`);

      this.pumpTimeout = lt.setTimeout(() => {
        this.pumpTimeout = null;
        pump().then(resolve, reject);
      }, remaining);
    });
  }

  cancel() {
    if(this.pumpTimeout) {
      log.info("Cancelling scheduled pump job");
      lt.clearTimeout(this.pumpTimeout);
    }
  }
}

function pump() {
  const startTime = Date.now();
  log.info("Starting pump job");
  return pumpManager.start()
    .then(() => {
      const elapsed = Date.now() - startTime;
      log.email.info(`Pump job completed successfully (${formatTimeInterval(elapsed)})`);
    })
    .catch((error) => fatal.email("Pump job failed", error));
}

function schedulePumpJob() {
  waitingForManualTimes = false;
  return Promise.resolve()
    .then(cancelPumpJob)
    .then(getNextPumpTime)
    .then((pumpTime) => {
      if(pumpTime) {
        currentPumpJob = new PumpJob(pumpTime);
        return currentPumpJob.schedule();
      } else {
        waitingForManualTimes = true;
        return never;
      }
    });
}

function cancelPumpJob() {
  if(currentPumpJob) {
    currentPumpJob.cancel();
    currentPumpJob = null;
  }
}

function start() {
  schedulePumpJob()
    .then(
      start,
      (error) => fatal.email("Failed to schedule pump job", error)
    );
}

function stop() {
  cancelPumpJob();
}

function restart() {
  stop();
  start();
}

function getState() {
  let state;
  if(pumpManager.isPumping()) {
    state = "pumping";
  } else if(waitingForManualTimes) {
    state = "waiting_for_times";
  } else {
    state = "waiting_to_pump";
  }
  return {
    state,
    scheduledPumpDate: currentPumpJob ? currentPumpJob.pumpTime : null,
    manual: config.get("manual")
  };
}

module.exports = {start, stop, restart, getState};
