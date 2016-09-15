const co = require("co");
const lt = require("long-timeout");
const log = require("./log");
const fatal = require("./fatal");
const getNextPumpTime = require("./get-next-pump-time");
const formatTimeInterval = require("./util/format-time-interval");

const wait = require("./util/wait");
const {HOUR} = require("./time-constants");

function pump() {
  log.email.info("Starting pump job");
  return wait(HOUR / 2)
    .then(() => {
      log.email.info("Pump job finished successfully");
    })
    .catch((error) => fatal("Pump job failed", error));
}

const schedulePumpJob = co.wrap(function* () {
  const nextPumpTime = yield getNextPumpTime();
  const remaining = nextPumpTime.getTime() - Date.now();
  log.info(`Scheduling pump job for ${nextPumpTime} (${formatTimeInterval(remaining)} remaining)`);
  yield wait(remaining);
  yield pump();
});

module.exports = function startPumpLoop() {
  schedulePumpJob()
    .then(
      startPumpLoop,
      (error) => fatal("Failed to schedule pump job", error)
    );
}
