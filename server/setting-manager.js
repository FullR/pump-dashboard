import SettingManager from "./setting-manager-class";
import {writeFile, readFileSync} from "fs";
import {log} from "./log-manager";

const filename = `${__dirname}/settings.json`;
let settings;

try {
  settings = JSON.parse(readFileSync(filename));
} catch(error) {
  log("error", `Failed to load settings from file system: ${error}`);
  settings = {};
}

const settingManager = new SettingManager(settings);

settingManager.on("change", saveSettings);

function saveSettings() {
  log("info", "Writing new settings to file system");
  writeFile(filename, settingManager.json, (error) => {
    if(error) {
      log("error", `Failed to write settings to file system: ${error.message}`);
    } else {
      log("info", "Settings successfully written to file system");
    }
  });
}

export default settingManager;
