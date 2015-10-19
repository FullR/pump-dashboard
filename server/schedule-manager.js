import {writeFile} from "fs";
import ScheduleManager from "./schedule-manager-class";
import {log} from "./log-manager";

let scheduleManager;
let scheduleData;

try {
  scheduleData = require("./schedule");
} catch(error) {
  log("error", `Failed to load schedule settings from file system: ${error.message}`);
  scheduleData = {
    manual: false,
    automaticSchedule: [],
    manualSchedule: []
  };
}

scheduleManager = new ScheduleManager(scheduleData)
  .on("change", saveScheduleSettings);

function saveScheduleSettings() {
  log("info", "Writing new schedule settings to file system");
  writeFile(__dirname + "/schedule.json", scheduleManager.json, (error) => {
    if(error) {
      log("error", `Failed to write schedule settings to file system: ${error.message}`);
    } else {
      log("info", "Schedule settings successfully written to file system");
    }
  });
}

export default scheduleManager;
