const co = require("co");
const lt = require("long-timeout");
const log = require("./log");
const fatal = require("./fatal");
const getNextPumpTime = require("./get-next-pump-time");
const formatTimeInterval = require("./util/format-time-interval");
const pumpManager = require("./pump-manager");

const wait = require("./util/wait");
const {HOUR} = require("./time-constants");

function pump() {
  const startTime = Date.now();
  return pumpManager.start()
    .then(() => {
      const elapsed = Date.now() - startTime;
      log.email.info(`Pump job completed successfully (${formatTimeInterval(elapsed)})`);
    })
    .catch((error) => fatal.email("Pump job failed", error));
}

const schedulePumpJob = co.wrap(function* () {
  const nextPumpTime = yield getNextPumpTime();
  const remaining = nextPumpTime.getTime() - Date.now();
  log.info(`Scheduling next pump job for ${nextPumpTime} (${formatTimeInterval(remaining)} remaining)`);
  yield wait(remaining);
  yield pump();
});

module.exports = function startPumpLoop() {
  schedulePumpJob()
    .then(
      startPumpLoop,
      (error) => fatal.email("Failed to schedule pump job", error)
    );
}
