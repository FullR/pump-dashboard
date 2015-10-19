"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _fs = require("fs");

var _scheduleManagerClass = require("./schedule-manager-class");

var _scheduleManagerClass2 = _interopRequireDefault(_scheduleManagerClass);

var _logManager = require("./log-manager");

var scheduleManager = undefined;
var scheduleData = undefined;

try {
  scheduleData = require("./schedule");
} catch (error) {
  (0, _logManager.log)("error", "Failed to load schedule settings from file system: " + error.message);
  scheduleData = {
    manual: false,
    automaticSchedule: [],
    manualSchedule: []
  };
}

scheduleManager = new _scheduleManagerClass2["default"](scheduleData).on("change", saveScheduleSettings);

function saveScheduleSettings() {
  (0, _logManager.log)("info", "Writing new schedule settings to file system");
  (0, _fs.writeFile)(__dirname + "/schedule.json", scheduleManager.json, function (error) {
    if (error) {
      (0, _logManager.log)("error", "Failed to write schedule settings to file system: " + error.message);
    } else {
      (0, _logManager.log)("info", "Schedule settings successfully written to file system");
    }
  });
}

exports["default"] = scheduleManager;
module.exports = exports["default"];