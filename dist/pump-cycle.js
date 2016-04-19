"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = runCycle;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _rx = require("rx");

var _rx2 = _interopRequireDefault(_rx);

var _lodash = require("lodash");

var _utilAutoObservable = require("./util/autoObservable");

var _utilAutoObservable2 = _interopRequireDefault(_utilAutoObservable);

var _utilMaybeTimeout = require("./util/maybeTimeout");

var _utilMaybeTimeout2 = _interopRequireDefault(_utilMaybeTimeout);

var _utilDelay = require("./util/delay");

var _utilDelay2 = _interopRequireDefault(_utilDelay);

var Observable = _rx2["default"].Observable;
var Observer = _rx2["default"].Observer;
var BehaviorSubject = _rx2["default"].BehaviorSubject;
var combineLatest = Observable.combineLatest;
var fromArray = Observable.fromArray;
var concat = Observable.concat;

var blankObserver = Observer.create(_lodash.noop, _lodash.noop, _lodash.noop);
var isTrue = function isTrue(v) {
  return !!v;
};

function runCycle() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref$inputs = _ref.inputs;
  var inputs = _ref$inputs === undefined ? {
    valve1Closed: valve1Closed,
    valve2Closed: valve2Closed,
    valveClosed: valveClosed,
    valveOpened: valveOpened,
    lowPressure: lowPressure,
    primeComplete: primeComplete,
    tankIsFull: tankIsFull,
    emergencyStop: emergencyStop
  } : _ref$inputs;
  var _ref$outputs = _ref.outputs;
  var outputs = _ref$outputs === undefined ? {} : _ref$outputs;
  var _ref$timeouts = _ref.timeouts;
  var timeouts = _ref$timeouts === undefined ? {} : _ref$timeouts;
  var _ref$log = _ref.log;
  var log = _ref$log === undefined ? _lodash.noop : _ref$log;

  timeouts = (0, _lodash.defaults)({}, timeouts, {
    closeValvesTimeout: 0,
    primeTimeout: 0,
    pumpTimeout: 0,
    pressureMonitorDelay: 0,
    postPumpValveDelay: 0,
    primeDelay: 0
  });

  outputs = (0, _lodash.defaults)({}, outputs, {
    closeValves: blankObserver,
    openValve: blankObserver,
    runPrime: blankObserver,
    runPump: blankObserver
  });

  return Observable.create(function (cycleObserver) {
    function closeValves() {
      return Observable.create(function (observer) {
        log("Closing valves...");
        // const valvesClosed = Observable.combineLatest(
        //   inputs.valve1Closed,
        //   inputs.valve2Closed,
        //   (a, b) => {
        //     console.log("a = " + a,"b = " + b);
        //     return a && b;
        //   }
        // );
        var valvesClosed = inputs.valve1Closed;
        var sub = valvesClosed.filter(isTrue).take(1).subscribe(function () {
          log("Valves closed");
          observer.onNext();
          observer.onCompleted();
        });

        outputs.closeValves.onNext(true);

        return function () {
          outputs.closeValves.onNext(false);
          sub.dispose();
        };
      });
    }

    function startPrimePump() {
      return (0, _utilAutoObservable2["default"])(function () {
        log("Starting prime pump");
        outputs.runPrime.onNext(true);
      });
    }

    function waitForPrime() {
      log("Waiting for prime signal...");
      return inputs.primeComplete.filter(isTrue).take(1)["do"](function () {
        log("Prime signal received");
      });
    }

    function openValve() {
      return Observable.create(function (observer) {
        log("Opening valve");
        outputs.openValve.onNext(true);

        var disposable = (0, _utilDelay2["default"])(30000).subscribe(function () {
          log("Valve opened");
          outputs.openValve.onNext(false);
        });

        observer.onNext();
        observer.onCompleted();
      });
    }

    function startPump() {
      return Observable.create(function (observer) {
        log("Starting pump");
        outputs.runPump.onNext(true);
        observer.onNext();
        observer.onCompleted();
      });
    }

    function monitorTankAndPressure() {
      return Observable.create(function (observer) {
        log("Waiting for tank full and monitoring pressure");
        var lowPressureObs = inputs.lowPressure.filter(isTrue).take(1).map(function () {
          throw new Error("low pressure");
        })["do"](function () {
          return log("Low pressure signal received");
        });
        var tankFullObs = inputs.tankIsFull.filter(isTrue).take(1);

        var sub = tankFullObs.merge(lowPressureObs).subscribe(function () {
          log("Finished pumping (tank is full)");
          observer.onNext();
          observer.onCompleted();
        }, function (error) {
          observer.onError(error);
        });

        return function () {
          log("Stopping pump and prime pump");
          outputs.runPump.onNext(false);
          outputs.runPrime.onNext(false);
          sub.dispose();
        };
      });
    }

    function cleanUp() {
      log("Shutting off outputs");
      outputs.runPrime.onNext(false);
      outputs.runPump.onNext(false);
      outputs.openValve.onNext(false);
      outputs.closeValves.onNext(false);
    }

    var sub = (0, _utilMaybeTimeout2["default"])(closeValves(), timeouts.closeValvesTimeout, "Close valves timeout reached")["do"](function () {
      return log("Waiting " + timeouts.primeDelay + "ms to begin prime...");
    }).flatMap(function () {
      return (0, _utilDelay2["default"])(timeouts.primeDelay);
    }).flatMap(startPrimePump).flatMap(function () {
      return (0, _utilMaybeTimeout2["default"])(waitForPrime(), timeouts.primeTimeout, "Priming timeout reached");
    }).flatMap(function () {
      log("Waiting 60 seconds to start pump...");
      return (0, _utilDelay2["default"])(60000);
    }).flatMap(function () {
      return startPump()["do"](function () {
        return log("Waiting " + timeouts.pressureMonitorDelay + "ms to monitor pressure...");
      });
    }).flatMap(function () {
      log("Waiting 30 seconds to open valve...");
      return (0, _utilDelay2["default"])(30000);
    }).flatMap(openValve).flatMap(function () {
      return (0, _utilDelay2["default"])(timeouts.pressureMonitorDelay);
    }).flatMap(function () {
      return (0, _utilMaybeTimeout2["default"])(monitorTankAndPressure(), timeouts.pumpTimeout, "Pumping timeout reached")["do"](function () {
        return log("Waiting " + timeouts.postPumpValveDelay + "ms to close valves...");
      });
    }).flatMap(function () {
      return (0, _utilDelay2["default"])(timeouts.postPumpValveDelay);
    }).flatMap(closeValves)["finally"](cleanUp).subscribe(_lodash.noop, function (error) {
      return cycleObserver.onError(error);
    }, function () {
      cycleObserver.onCompleted();
    });

    var emergencyStopSub = inputs.emergencyStop.filter(isTrue).take(1).subscribe(function () {
      var error = new Error("Emergency stop signal received");
      error._isEmergencyStopError = true; // for testing only
      cycleObserver.onError(error);
    });

    return function () {
      log("Stopping pump cycle");
      sub.dispose();
      emergencyStopSub.dispose();
    };
  });
}

module.exports = exports["default"];