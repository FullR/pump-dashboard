"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = startServer;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _passport = require("passport");

var _passport2 = _interopRequireDefault(_passport);

var _middleware = require("./middleware");

var _middleware2 = _interopRequireDefault(_middleware);

var _api = require("./api");

var _api2 = _interopRequireDefault(_api);

function startServer(port) {
  return new Promise(function (resolve, reject) {
    var app = (0, _express2["default"])();
    (0, _middleware2["default"])(app);
    app.use(_api2["default"]);
    app.listen(port, function (error) {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

module.exports = exports["default"];