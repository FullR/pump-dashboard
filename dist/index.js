"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

require("babel/polyfill");

var _lodash = require("lodash");

var _server = require("./server");

var _server2 = _interopRequireDefault(_server);

var _logManager = require("./log-manager");

var _utilFormatRemaining = require("./util/format-remaining");

var _utilFormatRemaining2 = _interopRequireDefault(_utilFormatRemaining);

var _scheduler2 = require("./scheduler");

var _scheduler3 = _interopRequireDefault(_scheduler2);

var _scheduleManager = require("./schedule-manager");

var _scheduleManager2 = _interopRequireDefault(_scheduleManager);

var _downloadTideData = require("./download-tide-data");

var _downloadTideData2 = _interopRequireDefault(_downloadTideData);

var _testSystem = require("./test-system");

var _testSystem2 = _interopRequireDefault(_testSystem);

var _pumpManager = require("./pump-manager");

var _pumpManager2 = _interopRequireDefault(_pumpManager);

var stationId = 9432780;
var port = 8080;
var scheduler = null;
var pumpDisposable = null;

_scheduleManager2["default"].on("change", scheduleNextPump);
scheduleNextPump();

(0, _server2["default"])(port).then(function () {
  (0, _logManager.log)("info", "Web server successfully started on port " + port);
})["catch"](function (error) {
  (0, _logManager.log)("error", "Failed to start server: " + error.message);
});

function scheduleNextPump() {
  var manual = _scheduleManager2["default"].manual;
  var currentSchedule = _scheduleManager2["default"].currentSchedule;

  if (scheduler) {
    scheduler.stop();
  }
  scheduler = new _scheduler3["default"](currentSchedule);
  var _scheduler = scheduler;
  var remaining = _scheduler.remaining;
  var nextTime = _scheduler.nextTime;

  (0, _logManager.log)("info", "Scheduling next pump job in " + (manual ? "manual" : "automatic") + " mode for " + new Date(nextTime) + ". " + (remaining < 0 ? "" : (0, _utilFormatRemaining2["default"])(remaining) + " remaining"));

  scheduler.once("empty", function () {
    scheduler.removeAllListeners();
    if (_scheduleManager2["default"].manual) {
      (0, _logManager.log)("error", "No remaining manual times. Please add new times or switch to automatic mode");
    } else {
      (0, _logManager.log)("info", "No remaining automatic times. Downloading new data from NOAA");
      (0, _downloadTideData2["default"])({ stationId: stationId }).then(function () {
        var automaticTideTimes = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

        (0, _logManager.log)("info", "Tide data downloaded successfully (" + automaticTideTimes.length + " high tide entries)");
        _scheduleManager2["default"].setAutomaticSchedule(automaticTideTimes);
      })["catch"](function (error) {
        (0, _logManager.log)("error", "Failed to download new tide data: " + error.message);
      });
    }
  }).on("interval", function () {
    _pumpManager2["default"].start().then(function () {
      (0, _logManager.log)("info", "Pump cycle completed successfully");
      scheduleNextPump();
    }, function (error) {
      (0, _logManager.log)("error", "Pump cycle failed: " + error.message + ". Restart the system when the issue has been resolved");
      scheduler.removeAllListeners();
    });
  }).scheduleNext();
}