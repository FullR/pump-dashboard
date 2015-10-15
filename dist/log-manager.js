"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require("fs");

var _rx = require("rx");

var _chalk = require("chalk");

var filename = __dirname + "/logs";
var logText = (0, _fs.readFileSync)(filename).toString();
var logs = JSON.parse("[" + logText.trim().split("\n").join(",") + "]");

function writeLog(_ref) {
  var timestamp = _ref.timestamp;
  var level = _ref.level;
  var message = _ref.message;

  (0, _fs.appendFile)(filename, "\n{\"timestamp\": " + timestamp + ", \"level\": \"" + level + "\", \"message\": \"" + message + "\"}", { flag: "a+" }, function (error) {
    if (error) {
      console.log("Failed to append log to file:", error);
    }
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
      console.log((0, _chalk.gray)(new Date(timestamp)) + " [" + levelColors.error(level) + "]: " + white(message), console.trace());
    } else {
      console.log((0, _chalk.gray)(new Date(timestamp)) + " [" + (levelColors[level] || levelColors.defaults)(level) + "]: " + message);
    }
    logs.push(logObj);
  }
};
module.exports = exports["default"];