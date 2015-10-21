"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _events = require("events");

var Scheduler = (function (_EventEmitter) {
  _inherits(Scheduler, _EventEmitter);

  function Scheduler() {
    var times = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

    _classCallCheck(this, Scheduler);

    _get(Object.getPrototypeOf(Scheduler.prototype), "constructor", this).call(this);
    this.times = times;
  }

  _createClass(Scheduler, [{
    key: "scheduleNext",
    value: function scheduleNext() {
      var _this = this;

      var nextTime = this.nextTime;

      var now = Date.now();
      this.stop();
      if (!nextTime) {
        this.emit("empty");
      } else {
        this._timeout = setTimeout(function () {
          _this.emit("interval", nextTime);
          _this.scheduleNext();
        }, nextTime - now);
      }

      return this;
    }
  }, {
    key: "stop",
    value: function stop() {
      clearTimeout(this._timeout);
    }
  }, {
    key: "nextTime",
    get: function get() {
      var now = Date.now();
      var validTimes = this.times.filter(function (t) {
        return t > now;
      });
      if (!validTimes.length) {
        return null;
      }
      return validTimes.reduce(function (a, b) {
        return Math.min(a, b);
      });
    }
  }, {
    key: "remaining",
    get: function get() {
      return this.nextTime - Date.now();
    }
  }]);

  return Scheduler;
})(_events.EventEmitter);

exports["default"] = Scheduler;
module.exports = exports["default"];