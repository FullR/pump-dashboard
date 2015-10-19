"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x5, _x6, _x7) { var _again = true; _function: while (_again) { var object = _x5, property = _x6, receiver = _x7; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x5 = parent; _x6 = property; _x7 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _events = require("events");

function isAddrDiff() {
  var addr1 = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
  var addr2 = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

  for (var i = 0; i < 4; i++) {
    if (addr1[i] !== addr2[i]) {
      return true;
    }
  }
  return false;
}

var SettingManager = (function (_EventEmitter) {
  _inherits(SettingManager, _EventEmitter);

  function SettingManager() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref$auto = _ref.auto;
    var auto = _ref$auto === undefined ? true : _ref$auto;
    var _ref$ip = _ref.ip;
    var ip = _ref$ip === undefined ? [0, 0, 0, 0] : _ref$ip;
    var _ref$subnet = _ref.subnet;
    var subnet = _ref$subnet === undefined ? [255, 255, 255, 0] : _ref$subnet;
    var _ref$gateway = _ref.gateway;
    var gateway = _ref$gateway === undefined ? [192, 168, 1, 1] : _ref$gateway;
    var _ref$closeValvesTimeout = _ref.closeValvesTimeout;
    var closeValvesTimeout = _ref$closeValvesTimeout === undefined ? 0 : _ref$closeValvesTimeout;
    var _ref$primeTimeout = _ref.primeTimeout;
    var primeTimeout = _ref$primeTimeout === undefined ? 0 : _ref$primeTimeout;
    var _ref$pumpTimeout = _ref.pumpTimeout;
    var pumpTimeout = _ref$pumpTimeout === undefined ? 0 : _ref$pumpTimeout;
    var _ref$primeDelay = _ref.primeDelay;
    var primeDelay = _ref$primeDelay === undefined ? 0 : _ref$primeDelay;
    var _ref$postPumpValveDelay = _ref.postPumpValveDelay;
    var postPumpValveDelay = _ref$postPumpValveDelay === undefined ? 0 : _ref$postPumpValveDelay;
    var _ref$pressureMonitorDelay = _ref.pressureMonitorDelay;
    var pressureMonitorDelay = _ref$pressureMonitorDelay === undefined ? 0 : _ref$pressureMonitorDelay;
    var _ref$preTideDelay = _ref.preTideDelay;
    var preTideDelay = _ref$preTideDelay === undefined ? 0 : _ref$preTideDelay;

    _classCallCheck(this, SettingManager);

    _get(Object.getPrototypeOf(SettingManager.prototype), "constructor", this).call(this);
    this.model = {
      auto: auto,
      ip: ip,
      subnet: subnet,
      gateway: gateway,
      closeValvesTimeout: closeValvesTimeout,
      primeTimeout: primeTimeout,
      pumpTimeout: pumpTimeout,
      primeDelay: primeDelay,
      postPumpValveDelay: postPumpValveDelay,
      pressureMonitorDelay: pressureMonitorDelay,
      preTideDelay: preTideDelay
    };
    console.log(this.model);
  }

  _createClass(SettingManager, [{
    key: "set",
    value: function set() {
      var newSettings = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var lastModel = this.model;
      var model = this.model = Object.assign({}, this.model, newSettings);

      if (!!model.auto !== !!lastModel.auto || isAddrDiff(model.ip, lastModel.ip) || isAddrDiff(model.subnet, lastModel.subnet) || isAddrDiff(model.gateway, lastModel.gateway)) {
        this.emit("network-change", this.model);
      }

      this.emit("change", this.model);
      return this;
    }
  }, {
    key: "json",
    get: function get() {
      return JSON.stringify(this.model, null, 2);
    }
  }]);

  return SettingManager;
})(_events.EventEmitter);

exports["default"] = SettingManager;
module.exports = exports["default"];