"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _rx = require("rx");

var _downloadTideData = require("./download-tide-data");

var _downloadTideData2 = _interopRequireDefault(_downloadTideData);

var _logManager = require("./log-manager");

var _utilDelay = require("./util/delay");

var _utilDelay2 = _interopRequireDefault(_utilDelay);

var _utilFormatRemaining = require("./util/format-remaining");

var _utilFormatRemaining2 = _interopRequireDefault(_utilFormatRemaining);

var stream = new _rx.BehaviorSubject(require("./schedule"));

function enableManualMode() {
  var manualSchedule = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

  var newSchedule = Object.assign({}, stream.getValue(), { manual: true, manualSchedule: manualSchedule });
  stream.onNext(newSchedule);
}

function disableManualMode() {
  var newSchedule = Object.assign({}, stream.getValue(), { manual: false });
  stream.onNext(newSchedule);
}

function fetchNewData() {
  return (0, _downloadTideData2["default"])({ stationId: 9432780 }).take(1)["do"](function (automaticSchedule) {
    var newSchedule = Object.assign({}, stream.getValue(), { automaticSchedule: automaticSchedule });
    (0, _logManager.log)("info", "Successfully downloaded new tide data");
    stream.onNext(newSchedule);
  }, function (error) {
    (0, _logManager.log)("error", "Failed to fetch tide data from NOAA: " + error.message);
  });
}

function getNextPumpTime(times) {
  if (!times.length) {
    return null;
  }
  return getValidPumpTimes(times).reduce(function (a, b) {
    return Math.min(a, b);
  });
}

function getValidPumpTimes(times) {
  var now = Date.now();
  return times.filter(function (time) {
    return time && time > now;
  });
}

function start() {
  var _stream$getValue = stream.getValue();

  var manual = _stream$getValue.manual;
  var manualSchedule = _stream$getValue.manualSchedule;
  var automaticSchedule = _stream$getValue.automaticSchedule;

  var currentSchedule = manual ? manualSchedule : automaticSchedule;
  var nextPumpTime = getNextPumpTime(currentSchedule);

  if (!nextPumpTime) {
    if (manual) {
      (0, _logManager.log)("error", "No valid times found in manual mode. Cannot schedule pump job.");
    } else {
      (0, _logManager.log)("info", "No valid times found in automatic mode. Downloading new data.");
      fetchNewData().subscribe(start, function (error) {
        (0, _logManager.log)("error", "Failed to download new tide data: " + error.message);
        setTimeout(start, 1);
      });
    }
  } else {
    var remaining = nextPumpTime - Date.now();
    (0, _logManager.log)("info", "Scheduling pump job for " + new Date(nextPumpTime) + ". " + (0, _utilFormatRemaining2["default"])(remaining) + " remaining");

    (0, _utilDelay2["default"])(remaining).flatMap(function () {
      (0, _logManager.log)("info", "Running pump cycle");
      return wait(5000);
    }).take(1).subscribe(function () {
      (0, _logManager.log)("info", "Scheduled pump job finished successfully");
      setTimeout(start, 1);
    }, function (error) {
      (0, _logManager.log)("error", error.message);
      setTimeout(start, 1);
    });
  }
}

exports["default"] = {
  stream: stream,
  enableManualMode: enableManualMode,
  disableManualMode: disableManualMode,
  start: start
};
module.exports = exports["default"];