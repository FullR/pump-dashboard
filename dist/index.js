"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

require("babel/polyfill");

var _server = require("./server");

var _server2 = _interopRequireDefault(_server);

var _rx = require("rx");

var _logManager = require("./log-manager");

var _scheduleManager = require("./schedule-manager");

var _scheduleManager2 = _interopRequireDefault(_scheduleManager);

var port = 8080;

(0, _server2["default"])(port).then(function () {
  (0, _logManager.log)("info", "Web server successfully started on port " + port);
})["catch"](function (error) {
  (0, _logManager.log)("error", "Failed to start server: " + error.message);
});

_scheduleManager2["default"].start();