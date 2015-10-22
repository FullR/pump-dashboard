"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require("fs");

var _child_process = require("child_process");

var _rx = require("rx");

var _chalk = require("chalk");

var appendQueue = Promise.resolve();
var filename = __dirname + "/logs";
var logText = undefined;

try {
  logText = (0, _fs.readFileSync)(filename).toString();
} catch (error) {
  logText = "";
  console.log("Failed to load existing logs from file. Clearing log file");
  (0, _child_process.exec)("rm " + filename, function (error) {
    if (error) {
      console.log("Failed to remove existing log file: " + error.message);
    } else {
      console.log("Suceessfully removed invalid log file");
    }
  });
}

var enqueue = function enqueue(fn) {
  appendQueue = appendQueue.then(fn);
};
var logs = JSON.parse("[" + logText.trim().split("\n").join(",") + "]");

function append(filename, data, options) {
  return new Promise(function (resolve, reject) {
    (0, _fs.appendFile)(filename, data, options, function (error) {
      if (error) reject(error);else resolve();
    });
  });
}

function writeLog(_ref) {
  var timestamp = _ref.timestamp;
  var level = _ref.level;
  var message = _ref.message;

  var errorHandler = function errorHandler() {
    return console.log("Failed to append log entry to log file:", error);
  };
  enqueue(function () {
    return append(filename, "\n{\"timestamp\": " + timestamp + ", \"level\": \"" + level + "\", \"message\": \"" + message + "\"}", { flag: "a+" })["catch"](errorHandler);
  });
}

var levelColors = {
  info: _chalk.green.bold,
  warning: _chalk.yellow.bold,
  error: _chalk.red.bold,
  defaults: function defaults(s) {
    return s;
  }
};

exports["default"] = {
  getLogs: function getLogs() {
    return logs;
  },

  log: function log(level, message) {
    if (arguments.length < 2) {
      message = level;
      level = "info";
    }
    var timestamp = Date.now();
    var logObj = { timestamp: timestamp, level: level, message: message };
    writeLog(logObj);
    if (level === "error") {
      console.log((0, _chalk.gray)(new Date(timestamp)) + " [" + levelColors.error(level) + "]: " + message, console.trace());
    } else {
      console.log((0, _chalk.gray)(new Date(timestamp)) + " [" + (levelColors[level] || levelColors.defaults)(level) + "]: " + message);
    }
    logs.push(logObj);
  }
};
module.exports = exports["default"];