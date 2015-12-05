"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x4, _x5, _x6) { var _again = true; _function: while (_again) { var object = _x4, property = _x5, receiver = _x6; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x4 = parent; _x5 = property; _x6 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _events = require("events");

var ScheduleManager = (function (_EventEmitter) {
  _inherits(ScheduleManager, _EventEmitter);

  function ScheduleManager() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref$manualSchedule = _ref.manualSchedule;
    var manualSchedule = _ref$manualSchedule === undefined ? [] : _ref$manualSchedule;
    var _ref$automaticSchedule = _ref.automaticSchedule;
    var automaticSchedule = _ref$automaticSchedule === undefined ? [] : _ref$automaticSchedule;
    var _ref$manual = _ref.manual;
    var manual = _ref$manual === undefined ? false : _ref$manual;

    _classCallCheck(this, ScheduleManager);

    _get(Object.getPrototypeOf(ScheduleManager.prototype), "constructor", this).call(this);
    this.automaticSchedule = automaticSchedule;
    this.manualSchedule = manualSchedule;
    this.manual = manual;
  }

  _createClass(ScheduleManager, [{
    key: "_change",
    value: function _change() {
      this.emit("change", this);
    }
  }, {
    key: "enableManual",
    value: function enableManual(newManualSchedule) {
      this.manual = true;
      if (newManualSchedule) {
        this.manualSchedule = newManualSchedule;
      }
      this._change();
    }
  }, {
    key: "disableManual",
    value: function disableManual() {
      this.manual = false;
      this._change();
    }
  }, {
    key: "setManualSchedule",
    value: function setManualSchedule() {
      var newManualSchedule = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

      this.manualSchedule = newManualSchedule;
      this._change();
    }
  }, {
    key: "setAutomaticSchedule",
    value: function setAutomaticSchedule() {
      var newAutomaticSchedule = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

      this.automaticSchedule = newAutomaticSchedule;
      this._change();
    }
  }, {
    key: "model",
    get: function get() {
      var automaticSchedule = this.automaticSchedule;
      var manualSchedule = this.manualSchedule;
      var manual = this.manual;

      return { automaticSchedule: automaticSchedule, manualSchedule: manualSchedule, manual: manual };
    }
  }, {
    key: "json",
    get: function get() {
      return JSON.stringify(this.model, null, 2);
    }
  }, {
    key: "currentSchedule",
    get: function get() {
      return this.manual ? this.manualSchedule : this.automaticSchedule;
    }
  }]);

  return ScheduleManager;
})(_events.EventEmitter);

exports["default"] = ScheduleManager;
module.exports = exports["default"];