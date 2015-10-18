"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _fs = require("fs");

var _scheduleManagerClass = require("./schedule-manager-class");

var _scheduleManagerClass2 = _interopRequireDefault(_scheduleManagerClass);

var _logManager = require("./log-manager");

var scheduleManager = new _scheduleManagerClass2["default"](require("./schedule")).on("change", saveScheduleSettings);

function saveScheduleSettings() {
  (0, _logManager.log)("info", "Writing new schedule settings to file system");
  (0, _fs.writeFile)(__dirname + "/schedule.json", scheduleManager.json, function (error) {
    if (error) {
      (0, _logManager.log)("error", "Failed to write schedule settings to file: " + error.message);
    }
  });
}

exports["default"] = scheduleManager;
module.exports = exports["default"];