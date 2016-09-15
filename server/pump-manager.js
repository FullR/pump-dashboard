const isBeaglebone = require("./util/is-beaglebone");
const testSystem = require("./test-system");
const externalSystem = require("./external-system");
const {noop} = require("lodash");
const log = require("./log");
const {pumpTimeouts} = require("../config");

const currentSystem = isBeaglebone ? externalSystem : testSystem;

let pumpDisposable = null;
let pumpPromise = null;

function start() {
  if(pumpPromise) {
    log.email.error("Attempted to start pump cycle, but the pumps are already running (ignoring)");
  } else {
    log.email.info(`Starting pump cycle using ${isBeaglebone ? "external" : "test"} system`);
    pumpPromise = new Promise((resolve, reject) => {
      pumpDisposable = currentSystem({
        timeouts: pumpTimeouts,
        log,
        logError: log.error
      }).subscribe(
        noop,
        (error) => {
          pumpDisposable = pumpPromise = null;
          reject(error);
        },
        () => {
          pumpDisposable = pumpPromise = null;
          resolve();
        }
      );
    });
  }

  return pumpPromise;
}

function stop() {
  log("info", "Stopping pump cycle");
  if(isRunning()) {
    pumpDisposable.dispose();
    pumpDisposable = pumpPromise = null;
  }
}

function isRunning() {
  return !!pumpPromise;
}

module.exports = {start, stop, isRunning};
