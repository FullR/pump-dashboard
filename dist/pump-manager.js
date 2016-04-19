"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _settings = require("./settings");

var _testSystem = require("./test-system");

var _testSystem2 = _interopRequireDefault(_testSystem);

var _externalSystem = require("./external-system");

var _externalSystem2 = _interopRequireDefault(_externalSystem);

var _lodash = require("lodash");

var _logManager = require("./log-manager");

var _settings2 = _interopRequireDefault(_settings);

var currentSystem = _settings.onPC ? _testSystem2["default"] : _externalSystem2["default"];

if (_settings.onPC) {
  (0, _logManager.log)("onPC = true (disable this in settings.json if running on Beaglebone)");
}

var pumpDisposable = null;
var pumpPromise = null;

function start() {
  (0, _logManager.log)("info", "Starting pump cycle");
  if (pumpPromise) {
    (0, _logManager.log)("warning", "Attempted to start pump cycle, but the pumps are already running");
  } else {
    pumpPromise = new Promise(function (resolve, reject) {
      pumpDisposable = currentSystem({
        timeouts: _settings2["default"],
        log: _logManager.log
      }).subscribe(_lodash.noop, function (error) {
        pumpDisposable = null;
        pumpPromise = null;
        reject(error);
      }, function () {
        pumpDisposable = null;
        pumpPromise = null;
        resolve();
      });
    });
  }

  return pumpPromise;
}

function stop() {
  (0, _logManager.log)("info", "Stopping pump cycle");
  if (pumpDisposable) {
    pumpDisposable.dispose();
    pumpDisposable = pumpPromise = null;
  }
}

function isRunning() {
  return !!pumpPromise;
}

exports["default"] = { start: start, stop: stop, isRunning: isRunning };
module.exports = exports["default"];