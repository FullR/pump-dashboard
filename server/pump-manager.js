const isBeaglebone = require("./util/is-beaglebone");
const testSystem = require("./test-system");
const externalSystem = require("./external-system");
const {noop} = require("lodash");
const log = require("./log");
const config = require("./config");

const currentSystem = isBeaglebone ? externalSystem : testSystem;

let pumpDisposable = null;
let pumpPromise = null;
let pumpDeferred = null;

function defer() {
  const deferred = {};
  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  return deferred;
}

function start() {
  if(pumpDeferred) {
    log.email.error("Attempted to start pump cycle, but the pumps are already running (ignoring)");
  } else {
    log.email.info(`Starting pump cycle using ${isBeaglebone ? "external" : "test"} system`);
    pumpDeferred = defer();
    pumpDisposable = currentSystem({
      timeouts: config.get("pumpTimeouts"),
      log,
      logError: log.error
    }).subscribe(
      noop,
      (error) => {
        console.log("rejected", error);
        pumpDeferred.reject(error);
        pumpDisposable = pumpDeferred = null;
      },
      () => {
        console.log("resolved");
        pumpDeferred.resolve();
        pumpDisposable = pumpDeferred = null;
      }
    );
  }

  return pumpDeferred.promise;
}

function stop() {
  log("info", "Stopping pump cycle");
  if(isPumping()) {
    pumpDisposable.dispose();
    pumpDeferred.resolve();
    pumpDisposable = pumpDeferred = null;
  }
}

function isPumping() {
  return !!pumpDeferred;
}

module.exports = {start, stop, isPumping};
