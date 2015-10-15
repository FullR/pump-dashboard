"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = maybeTimeout;

var _rx = require("rx");

function maybeTimeout(observable, ms, errorText) {
  return ms ? observable.timeout(ms, _rx.Observable["throw"](new Error(errorText))) : observable;
}

module.exports = exports["default"];