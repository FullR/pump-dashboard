"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = externalSystem;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _cylon = require("cylon");

var _cylon2 = _interopRequireDefault(_cylon);

var _lodash = require("lodash");

var _rx = require("rx");

var _pumpCycle = require("./pump-cycle");

var _pumpCycle2 = _interopRequireDefault(_pumpCycle);

var _pinConfig = require("./pin-config");

var _pinConfig2 = _interopRequireDefault(_pinConfig);

var identity = function identity(v) {
  return v;
};
var negate = function negate(v) {
  return !v;
};

function buttonObservable(device, mode) {
  if (mode) {
    mode = mode.toLowerCase();
  }
  return _rx.Observable.create(function (observer) {
    function onPush() {
      observer.onNext(true);
    }

    function onRelease() {
      observer.onNext(false);
    }

    device.on("push", onPush);
    device.on("release", onRelease);

    return function () {
      device.removeListener("push", onPush);
      device.removeListener("release", onRelease);
    };
  }).map(mode === "falling" ? negate : identity);
}

function pinObserver() {
  for (var _len = arguments.length, devices = Array(_len), _key = 0; _key < _len; _key++) {
    devices[_key] = arguments[_key];
  }

  return _rx.Observer.create(function (v) {
    return devices.forEach(function (d) {
      return d.digitalWrite(v ? 1 : 0);
    });
  }, function (error) {
    return console.log(error);
  }, function () {
    return devices.forEach(function (d) {
      return d.digitalWrite(0);
    });
  });
}

function externalSystem() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref$timeouts = _ref.timeouts;
  var timeouts = _ref$timeouts === undefined ? {} : _ref$timeouts;
  var log = _ref.log;
  var _ref$pump = _ref.pump;
  var pump = _ref$pump === undefined ? "1" : _ref$pump;

  var pin = function pin(driver, io, name) {
    var pinCfg = _pinConfig2["default"][io][name];
    if (!pinCfg) {
      console.log(name + " not found");
    }
    return { driver: driver, pin: pinCfg.pin };
  };

  return _rx.Observable.create(function (observer) {
    return _cylon2["default"].robot({
      connections: { beaglebone: { adaptor: "beaglebone" } },
      devices: {
        valve1Closed: pin("button", "inputs", "valve1Closed"),
        valve2Closed: pin("button", "inputs", "valve2Closed"),
        valve1Opened: pin("button", "inputs", "valve1Opened"),
        valve2Opened: pin("button", "inputs", "valve2Opened"),
        primeComplete: pin("button", "inputs", "primeComplete"),
        lowPressure: pin("button", "inputs", "lowPressure"),
        tankIsFull: pin("button", "inputs", "tankIsFull"),
        emergencyStop: pin("button", "inputs", "emergencyStop"),

        closeValve1: pin("direct-pin", "outputs", "closeValve1"),
        closeValve2: pin("direct-pin", "outputs", "closeValve2"),
        openValve1: pin("direct-pin", "outputs", "openValve1"),
        openValve2: pin("direct-pin", "outputs", "openValve2"),
        runPrime: pin("direct-pin", "outputs", "runPrime"),
        startPump1: pin("direct-pin", "outputs", "startPump1"),
        startPump2: pin("direct-pin", "outputs", "startPump2")
      },

      work: function work() {
        var valve1Closed = buttonObservable(this.valve1Closed);
        var valve2Closed = buttonObservable(this.valve2Closed);
        var valveOpened = buttonObservable(pump === "1" ? this.valve1Opened : this.valve2Opened);
        var primeComplete = buttonObservable(this.primeComplete);
        var lowPressure = buttonObservable(this.lowPressure, _pinConfig2["default"].inputs.lowPressure.mode);
        var tankIsFull = buttonObservable(this.tankIsFull);
        var emergencyStop = buttonObservable(this.emergencyStop, _pinConfig2["default"].inputs.emergencyStop.mode);

        var closeValves = pinObserver(this.closeValve1, this.closeValve2);
        var openValve = pinObserver(pump === "1" ? this.openValve1 : this.openValve2);
        var runPrime = pinObserver(this.runPrime);
        var runPump = pinObserver(pump === "1" ? this.startPump1 : this.startPump2);

        var inputs = { valve1Closed: valve1Closed, valve2Closed: valve2Closed, valveOpened: valveOpened, primeComplete: primeComplete, lowPressure: lowPressure, tankIsFull: tankIsFull, emergencyStop: emergencyStop };
        var outputs = { closeValves: closeValves, openValve: openValve, runPrime: runPrime, runPump: runPump };
        (0, _pumpCycle2["default"])({ inputs: inputs, outputs: outputs, timeouts: timeouts, log: log }).subscribe(observer);
      }
    }).start();
  });
}

module.exports = exports["default"];