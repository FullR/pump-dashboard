"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _settingManagerClass = require("./setting-manager-class");

var _settingManagerClass2 = _interopRequireDefault(_settingManagerClass);

var _fs = require("fs");

var _logManager = require("./log-manager");

var filename = __dirname + "/settings.json";
var settings = undefined;

try {
  settings = JSON.parse((0, _fs.readFileSync)(filename));
} catch (error) {
  (0, _logManager.log)("error", "Failed to load settings from file system: " + error);
  settings = {};
}

var settingManager = new _settingManagerClass2["default"](settings);

settingManager.on("change", saveSettings);

function saveSettings() {
  (0, _logManager.log)("info", "Writing new settings to file system");
  (0, _fs.writeFile)(filename, settingManager.json, function (error) {
    if (error) {
      (0, _logManager.log)("error", "Failed to write settings to file system: " + error.message);
    } else {
      (0, _logManager.log)("info", "Settings successfully written to file system");
    }
  });
}

exports["default"] = settingManager;
module.exports = exports["default"];