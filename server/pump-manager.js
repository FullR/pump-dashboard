import {onPC} from "./settings";
import testSystem from "./test-system";
import externalSystem from "./external-system";
import {noop} from "lodash";
import {log} from "./log-manager";
import settings from "./settings";

const currentSystem = onPC ? testSystem : externalSystem;

if(onPC) {
  log("onPC = true (disable this in settings.json if running on Beaglebone)");
}

let pumpDisposable = null;
let pumpPromise = null;

function start() {
  log("info", "Starting pump cycle");
  if(pumpPromise) {
    log("warning", "Attempted to start pump cycle, but the pumps are already running");
  } else {
    pumpPromise = new Promise((resolve, reject) => {
      pumpDisposable = currentSystem({
        timeouts: settings,
        log
      }).subscribe(
        noop,
        (error) => {
          pumpDisposable = null;
          pumpPromise = null;
          reject(error);
        },
        () => {
          pumpDisposable = null;
          pumpPromise = null;
          resolve();
        }
      );
    });
  }

  return pumpPromise;
}

function stop() {
  log("info", "Stopping pump cycle");
  if(pumpDisposable) {
    pumpDisposable.dispose();
    pumpDisposable = pumpPromise = null;
  }
}

function isRunning() {
  return !!pumpPromise;
}

export default {start, stop, isRunning};
