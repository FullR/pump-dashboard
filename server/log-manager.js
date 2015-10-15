import {readFileSync, appendFile} from "fs";
import {BehaviorSubject} from "rx";
import {red, yellow, green, gray} from "chalk";
const filename = __dirname + "/logs";
const logText = readFileSync(filename).toString();
const logs = JSON.parse(`[${logText.trim().split("\n").join(",")}]`);

function writeLog({timestamp, level, message}) {
  appendFile(filename, `\n{"timestamp": ${timestamp}, "level": "${level}", "message": "${message}"}`, {flag: "a+"}, (error) => {
    if(error) {
      console.log("Failed to append log to file:", error);
    }
  });
}

const levelColors = {
  info: green.bold,
  warning: yellow.bold,
  error: red.bold,
  defaults: (s) => s
};

export default {
  getLogs() {
    return logs;
  },

  log(level, message) {
    if(arguments.length < 2) {
      message = level;
      level = "info";
    }
    const timestamp = Date.now();
    const logObj = {timestamp, level, message};
    writeLog(logObj);
    if(level === "error") {
      console.log(`${gray(new Date(timestamp))} [${levelColors.error(level)}]: ${white(message)}`, console.trace());
    } else {
      console.log(`${gray(new Date(timestamp))} [${(levelColors[level] || levelColors.defaults)(level)}]: ${message}`);
    }
    logs.push(logObj);
  }
};
