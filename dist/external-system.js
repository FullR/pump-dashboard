"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = externalSystem;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _lodash = require("lodash");

var _rx = require("rx");

var _gpio = require("./gpio");

var _gpio2 = _interopRequireDefault(_gpio);

var _pumpCycle = require("./pump-cycle");

var _pumpCycle2 = _interopRequireDefault(_pumpCycle);

var _pinConfig = require("./pin-config");

var _pinConfig2 = _interopRequireDefault(_pinConfig);

var log = console.log.bind(console);
var identity = function identity(v) {
  return v;
};
var negate = function negate(v) {
  return !v;
};

function inputObservable(pinId, inverted) {
  return _rx.Observable.create(function (observer) {
    var stopWatching = _gpio2["default"].watchPin(pinId, function (value) {
      observer.onNext(inverted ? !value : value);
    });

    return function () {
      if (stopWatching) {
        stopWatching();
        stopWatching = null;
      }
    };
  });
}

function outputObserver(pinId) {
  return _rx.Observer.create(function (value) {
    return _gpio2["default"].setPinValue(pinId, value);
  }, log);
}

function externalSystem() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref$timeouts = _ref.timeouts;
  var timeouts = _ref$timeouts === undefined ? {} : _ref$timeouts;
  var log = _ref.log;
  var _ref$pump = _ref.pump;
  var pump = _ref$pump === undefined ? "1" : _ref$pump;

  var outputsConfigured = Promise.all((0, _lodash.map)(_pinConfig2["default"].outputs, function (_ref2, hardwareName) {
    var pin = _ref2.pin;
    var pinName = _ref2.pinName;

    console.log("Initializing output for " + hardwareName + " - " + pinName + " - GPIO " + pin);
    return _gpio2["default"].setupOutputPin(pin, false).then(function () {
      return log("Successfully initialized output " + hardwareName);
    })["catch"](function (error) {
      log("Failed to initialize output " + hardwareName + ": " + error);throw error;
    });
  }));
  var inputsConfigured = Promise.all((0, _lodash.map)(_pinConfig2["default"].inputs, function (_ref3, hardwareName) {
    var pin = _ref3.pin;
    var pinName = _ref3.pinName;

    console.log("Initializing input for " + hardwareName + " - " + pinName + " - GPIO " + pin);
    return _gpio2["default"].setupInputPin(pin, false).then(function () {
      return log("Successfully initialized output " + hardwareName);
    })["catch"](function (error) {
      log("Failed to initialize output " + hardwareName + ": " + error);throw error;
    });
  }));

  var pinsConfigured = Promise.all([outputsConfigured, inputsConfigured]);

  var inputObservables = (0, _lodash.transform)(_pinConfig2["default"].inputs, function (inputs, _ref4, pinId) {
    var pin = _ref4.pin;
    var inverted = _ref4.inverted;

    inputs[pinId] = inputObservable(pin, inverted);
  });

  var outputObservers = (0, _lodash.transform)(_pinConfig2["default"].outputs, function (outputs, _ref5, pinId) {
    var pin = _ref5.pin;

    outputs[pinId] = outputObserver(pin);
  });

  return _rx.Observable.fromPromise(Promise.all([outputsConfigured, inputsConfigured])).flatMap(function () {
    return (0, _pumpCycle2["default"])({
      inputs: inputObservables,
      outputs: outputObservers,
      timeouts: timeouts,
      log: log
    });
  });
}

module.exports = exports["default"];