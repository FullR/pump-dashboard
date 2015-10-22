import testSystem from "./test-system";
import {noop} from "lodash";
import {log} from "./log-manager";

let pumpDisposable = null;
let pumpPromise = null;

function start() {
  log("info", "Starting pump cycle");
  if(pumpPromise) {
    log("warning", "Attempted to start pump cycle, but the pumps are already running");
  } else {
    pumpPromise = new Promise((resolve, reject) => {
      pumpDisposable = testSystem().subscribe(
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
