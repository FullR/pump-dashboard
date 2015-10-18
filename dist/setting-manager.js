"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _rx = require("rx");

var _fs = require("fs");

var settingsStream = new _rx.BehaviorSubject(require("./settings"));

function writeSettings(settings) {
  (0, _fs.writeFile)("./settings.json", JSON.stringify(settings, null, 2), function (error) {
    if (error) {
      console.log("Failed to write settings to file system:", error);
    } else {
      console.log("Successfully wrote new settings to file system");
    }
  });
}

exports["default"] = {
  stream: settingsStream,
  update: function update(newSettings) {
    writeSettings(newSettings);
    settingsStream.onNext(Object.assign({}, settingsStream.getValue(), newSettings));
  }
};
module.exports = exports["default"];