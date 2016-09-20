const co = require("co");
const lt = require("long-timeout");
const log = require("./log");
const fatal = require("./fatal");
const getNextPumpTime = require("./get-next-pump-time");
const formatTimeInterval = require("./util/format-time-interval");
const pumpManager = require("./pump-manager");

const wait = require("./util/wait");
const {HOUR} = require("./time-constants");
let currentPumpJob = null;

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
      log.info("Cancelling schedules pump job");
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
  return Promise.resolve()
    .then(cancelPumpJob)
    .then(getNextPumpTime)
    .then((pumpTime) => {
      currentPumpJob = new PumpJob(pumpTime);
      return currentPumpJob.schedule();
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

module.exports = {start, stop, restart};
