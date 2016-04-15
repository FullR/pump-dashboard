import "babel/polyfill";
import {noop} from "lodash";
import server from "./server";
import {log} from "./log-manager";

import formatRemaining from "./util/format-remaining";
import Scheduler from "./scheduler";
import scheduleManager from "./schedule-manager";
import downloadTideData from "./download-tide-data";
import testSystem from "./test-system";
import pumpManager from "./pump-manager";
import settingManager from "./setting-manager";

const stationId = 9432780;
const port = 8081;
let scheduler = null;
let pumpDisposable = null;

scheduleManager.on("change", scheduleNextPump);
scheduleNextPump();

server(port)
  .then(() => {
    log("info", `Web server successfully started on port ${port}`);
  })
  .catch((error) => {
    log("error", `Failed to start server: ${error.message}`);
  });

function scheduleNextPump() {
  const {manual, currentSchedule} = scheduleManager;
  const {preTideDelay} = settingManager.model;

  if(scheduler) {
    scheduler.stop();
  }

  scheduler = manual ? 
    new Scheduler(currentSchedule) : 
    new Scheduler(currentSchedule.map((t) => t - (preTideDelay || 0)));

  scheduler
    .once("empty", () => {
      scheduler.removeAllListeners();

      if(scheduleManager.manual) {
        log("error", "No remaining manual times. Please add new times or switch to automatic mode");
      } else {
        log("info", "No remaining automatic times. Downloading new data from NOAA");
        downloadTideData({stationId})
          .then((automaticTideTimes=[]) => {
            log("info", `Tide data downloaded successfully (${automaticTideTimes.length} high tide entries)`);
            scheduleManager.setAutomaticSchedule(automaticTideTimes);
          })
          .catch((error) => {
            log("error", `Failed to download new tide data: ${error.message}`);
          });
      }
    })
    .on("interval", () => {
      pumpManager.start()
        .then(() => {
          log("info", "Pump cycle completed successfully");
          next();
        }, (error) => {
          log("error", `Pump cycle failed: ${error.message}. Restart the system when the issue has been resolved`);
          scheduler.removeAllListeners();
        });
    });

  next();

  function next() {
    if(scheduler.nextTime) {
      log("info", `Scheduling next pump job in ${manual ? "manual" : "automatic"} mode for ${new Date(scheduler.nextTime)}. ${formatRemaining(scheduler.remaining)} remaining`);
    }

    scheduler.scheduleNext();
  }
}
