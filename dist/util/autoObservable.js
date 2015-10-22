"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = autoObservable;

var _rx = require("rx");

var _lodash = require("lodash");

function autoObservable() {
  var bodyFn = arguments.length <= 0 || arguments[0] === undefined ? _lodash.noop : arguments[0];

  return _rx.Observable.create(function (observer) {
    bodyFn();
    observer.onNext();
    observer.onCompleted();
  });
}

module.exports = exports["default"];