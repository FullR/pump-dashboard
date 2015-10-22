import {readFileSync, appendFile} from "fs";
import {exec} from "child_process";
import {BehaviorSubject} from "rx";
import {red, yellow, green, gray} from "chalk";
let appendQueue = Promise.resolve();
const filename = __dirname + "/logs";
let logText;


try {
  logText = readFileSync(filename).toString();
} catch(error) {
  logText = "";
  console.log("Failed to load existing logs from file. Clearing log file");
  exec(`rm ${filename}`, (error) => {
    if(error) {
      console.log(`Failed to remove existing log file: ${error.message}`);
    } else {
      console.log("Suceessfully removed invalid log file");
    }
  })
}

const enqueue = (fn) => {appendQueue = appendQueue.then(fn);};
const logs = JSON.parse(`[${logText.trim().split("\n").join(",")}]`);

function append(filename, data, options) {
  return new Promise((resolve, reject) => {
    appendFile(filename, data, options, (error) => {
      if(error) reject(error);
      else resolve();
    })
  });
}

function writeLog({timestamp, level, message}) {
  const errorHandler = () => console.log("Failed to append log entry to log file:", error);
  enqueue(() => {
    return append(filename, `\n{"timestamp": ${timestamp}, "level": "${level}", "message": "${message}"}`, {flag: "a+"})
      .catch(errorHandler);
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
      console.log(`${gray(new Date(timestamp))} [${levelColors.error(level)}]: ${message}`, console.trace());
    } else {
      console.log(`${gray(new Date(timestamp))} [${(levelColors[level] || levelColors.defaults)(level)}]: ${message}`);
    }
    logs.push(logObj);
  }
};
