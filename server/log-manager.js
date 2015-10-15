import {readFileSync, appendFile} from "fs";
import {BehaviorSubject} from "rx";
const filename = __dirname + "/../logs";
const logText = readFileSync(filename).toString();
const logs = JSON.parse(`
  [
    ${logText.trim().split("\n").join(",")}
  ]
`);
const stream = new BehaviorSubject(logs)

function writeLog({timestamp, level, message}) {
  appendFile(filename, `\n{"timestamp": ${timestamp}, "level": "${level}", "message": "${message}"}`, {flag: "a+"}, (error) => {
    if(error) {
      console.log("Failed to append log to file:", error);
    }
  });
}

export default {
  stream,
  log(level, message) {
    if(arguments.length < 2) {
      message = level;
      level = "info";
    }
    const timestamp = Date.now();
    const logObj = {timestamp, level, message};
    writeLog(logObj);
    console.log(`${new Date(timestamp)} [${level}]: ${message}`);
    stream.onNext(stream.getValue().concat(logObj));
  }
};
