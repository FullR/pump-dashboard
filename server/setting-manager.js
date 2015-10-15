import {BehaviorSubject} from "rx";
import {writeFile} from "fs";
const settingsStream = new BehaviorSubject(require("../settings"));

function writeSettings(settings) {
  writeFile("./settings.json", JSON.stringify(settings, null, 2), (error) => {
    if(error) {
      console.log("Failed to write settings to file system:", error);
    } else {
      console.log("Successfully wrote new settings to file system");
    }
  });
}

export default {
  stream: settingsStream,
  update(newSettings) {
    writeSettings(newSettings);
    settingsStream.onNext(newSettings);
  }
};
