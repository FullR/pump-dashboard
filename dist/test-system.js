"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = testSystem;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _rx = require("rx");

var _utilDelay = require("./util/delay");

var _utilDelay2 = _interopRequireDefault(_utilDelay);

var _utilIsStream = require("./util/isStream");

var _utilIsStream2 = _interopRequireDefault(_utilIsStream);

var _pumpCycle = require("./pump-cycle");

var _pumpCycle2 = _interopRequireDefault(_pumpCycle);

var isTrue = function isTrue(v) {
  return !!v;
};

function fakeProcess(time, onCompleteObserver) {
  var value = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

  setTimeout(function () {
    return onCompleteObserver.onNext(value);
  }, time);
}

function testSystem() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref$times = _ref.times;
  var times = _ref$times === undefined ? {
    valve1CloseTime: 10,
    valve2CloseTime: 10,
    valveOpenTime: 10,
    primeTime: 10,
    pumpTime: 10
  } : _ref$times;
  var _ref$timeouts = _ref.timeouts;
  var timeouts = _ref$timeouts === undefined ? {} : _ref$timeouts;
  var _ref$initialValues = _ref.initialValues;
  var initialValues = _ref$initialValues === undefined ? {} : _ref$initialValues;
  var _ref$debug = _ref.debug;
  var debug = _ref$debug === undefined ? false : _ref$debug;
  var _ref$lowPressure = _ref.lowPressure;
  var lowPressure = _ref$lowPressure === undefined ? false : _ref$lowPressure;
  var log = _ref.log;

  var inputs = {
    valve1Closed: new _rx.BehaviorSubject(!!initialValues.valve1Closed),
    valve2Closed: new _rx.BehaviorSubject(!!initialValues.valve2Closed),
    valveOpened: new _rx.BehaviorSubject(!!initialValues.valveOpened),
    primeComplete: new _rx.BehaviorSubject(!!initialValues.primeComplete),
    lowPressure: new _rx.BehaviorSubject(!!initialValues.lowPressure),
    tankIsFull: new _rx.BehaviorSubject(!!initialValues.tankIsFull),
    emergencyStop: new _rx.BehaviorSubject(!!initialValues.emergencyStop)
  };

  var outputs = {
    closeValves: _rx.Observer.create(function (on) {
      if (on) {
        fakeProcess(times.valve1CloseTime, inputs.valve1Closed);
        fakeProcess(times.valve2CloseTime, inputs.valve2Closed);
      }
    }),
    openValve: _rx.Observer.create(function (on) {
      if (on) {
        fakeProcess(times.valveOpenTime, inputs.valveOpened);
      }
    }),
    runPrime: _rx.Observer.create(function (on) {
      if (on) {
        fakeProcess(times.primeTime, inputs.primeComplete);
      }
    }),
    runPump: _rx.Observer.create(function (on) {
      if (on) {
        fakeProcess(times.pumpTime, lowPressure ? inputs.lowPressure : inputs.tankIsFull);
      }
    })
  };

  return (0, _pumpCycle2["default"])({ inputs: inputs, outputs: outputs, timeouts: timeouts, log: log });
}

module.exports = exports["default"];