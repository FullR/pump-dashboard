import {BehaviorSubject} from "rx";
import downloadTideData from "./download-tide-data";
import {log} from "./log-manager";
import delay from "./util/delay";
import formatRemaining from "./util/format-remaining";

const stream = new BehaviorSubject(require("../schedule"));

function enableManualMode(manualSchedule=[]) {
  const newSchedule = Object.assign({}, stream.getValue(), {manual: true, manualSchedule});
  stream.onNext(newSchedule);
}

function disableManualMode() {
  const newSchedule = Object.assign({}, stream.getValue(), {manual: false});
  stream.onNext(newSchedule);
}

function fetchNewData() {
  return downloadTideData({stationId: 9432780}).take(1)
    .do((automaticSchedule) => {
      const newSchedule = Object.assign({}, stream.getValue(), {automaticSchedule});
      stream.onNext(newSchedule);
    }, (error) => {
      log("error", `Failed to fetch tide data from NOAA: ${error.message}`);
    });
}

function getNextPumpTime(times) {
  if(!times.length) {
    return null;
  }
  return getValidPumpTimes(times).reduce((a, b) => Math.min(a, b));
}

function getValidPumpTimes(times) {
  const now = Date.now();
  return times.filter((time) => time && time > now);
}

function start() {
  const {manual, manualSchedule, automaticSchedule} = stream.getValue();
  const currentSchedule = manual ? manualSchedule : automaticSchedule;
  const nextPumpTime = getNextPumpTime(currentSchedule);

  if(!nextPumpTime) {
    if(manual) {
      log("error", "No valid times found in manual mode. Cannot schedule pump job.");
    } else {
      log("info", "No valid times found in automatic mode. Downloading new data.");
      fetchNewData().do(() => {
        log("info", "Successfully downloaded new tide data")
      })
      .subscribe(start, (error) => {
        log("error", `Failed to download new tide data: ${error.message}`);
        setTimeout(start, 1);
      });
    }
  } else {
    const remaining = (nextPumpTime - Date.now());
    log("info", `Scheduling pump job for ${new Date(nextPumpTime)}. ${formatRemaining(remaining)} remaining`);
    
    delay(remaining)
      .flatMap(() => {
        log("info", "Running pump cycle");
        return wait(5000);
      })
      .take(1)
      .subscribe(() => {
        log("info", "Scheduled pump job finished successfully");
        setTimeout(start, 1);
      }, (error) => {
        log("error", error.message);
        setTimeout(start, 1);
      });
  }
}

export default {
  stream,
  enableManualMode,
  disableManualMode,
  start
};