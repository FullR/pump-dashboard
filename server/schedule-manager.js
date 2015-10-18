import {writeFile} from "fs";
import ScheduleManager from "./schedule-manager-class";
import {log} from "./log-manager";

const scheduleManager = new ScheduleManager(require("./schedule"))
  .on("change", saveScheduleSettings);

function saveScheduleSettings() {
  log("info", "Writing new schedule settings to file system");
  writeFile(__dirname + "/schedule.json", scheduleManager.json, (error) => {
    if(error) {
      log("error", `Failed to write schedule settings to file: ${error.message}`);
    }
  });
}

export default scheduleManager;
