"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _testSystem = require("./test-system");

var _testSystem2 = _interopRequireDefault(_testSystem);

var _lodash = require("lodash");

var _logManager = require("./log-manager");

var pumpDisposable = null;
var pumpPromise = null;

function start() {
  (0, _logManager.log)("info", "Starting pump cycle");
  if (pumpPromise) {
    (0, _logManager.log)("warning", "Attempted to start pump cycle, but the pumps are already running");
  } else {
    pumpPromise = new Promise(function (resolve, reject) {
      pumpDisposable = (0, _testSystem2["default"])().subscribe(_lodash.noop, function (error) {
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

exports["default"] = { start: start, stop: stop };
module.exports = exports["default"];