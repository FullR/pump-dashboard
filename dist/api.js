"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _passport = require("passport");

var _passport2 = _interopRequireDefault(_passport);

var _auth = require("./auth");

var _auth2 = _interopRequireDefault(_auth);

var _logManager = require("./log-manager");

var _logManager2 = _interopRequireDefault(_logManager);

var _settingManager = require("./setting-manager");

var _settingManager2 = _interopRequireDefault(_settingManager);

var _scheduleManager = require("./schedule-manager");

var _scheduleManager2 = _interopRequireDefault(_scheduleManager);

var _pumpManager = require("./pump-manager");

var _pumpManager2 = _interopRequireDefault(_pumpManager);

var log = _logManager2["default"].log;

var router = _express2["default"].Router();

router.route("/api/login").post(_passport2["default"].authenticate("local-login"), function (req, res) {
  res.end();
});

router.get("/api/logout", function (req, res) {
  req.logout();
  res.end();
});

router.route("/api/schedule").get(_auth2["default"], function (req, res) {
  res.json(_extends({}, _scheduleManager2["default"].model, {
    preTideDelay: _settingManager2["default"].model.preTideDelay
  }));
}).post(_auth2["default"], function (req, res) {
  var _req$body = req.body;
  var manual = _req$body.manual;
  var manualSchedule = _req$body.manualSchedule;

  log("info", "Received schedule settings from web client");

  if (req.body && req.body.manual) {
    if (manualSchedule.some(function (t) {
      return typeof t !== "number";
    })) {
      res.status(400).json({ error: "Invalid times" });
    } else {
      _scheduleManager2["default"].enableManual(manualSchedule);
      res.end();
    }
  } else {
    res.end();
  }
});

router.route("/api/settings").get(_auth2["default"], function (req, res) {
  res.json(_settingManager2["default"].model);
}).post(_auth2["default"], function (req, res) {
  _settingManager2["default"].set(req.body);
  res.end();
});

router.route("/api/logs").get(_auth2["default"], function (req, res) {
  res.json(_logManager2["default"].getLogs());
});

router.route("/api/pump").post(_auth2["default"], function (req, res) {
  log("info", "Received manual pump signal from client. Starting pump cycle");
  _pumpManager2["default"].start().then(function () {
    log("info", "Pumping completed");
  })["catch"](function (error) {
    log("error", "Pumping failed: " + error.message);
  });

  res.end();
});

router.get("/", function (req, res) {
  var user = req.user || {};
  var isAuthenticated = req.isAuthenticated();
  res.set("Content-Type", "text/html").end("\n    <!doctype html>\n    <html>\n    <head>\n      <title>SmartPump</title>\n    </head>\n    <body>\n      <script type=\"text/javascript\">\n        window.USER = " + (isAuthenticated ? JSON.stringify(user, null, 2) : null) + ";\n      </script>\n      <script src=\"app.js\" type=\"text/javascript\"></script>\n    </body>\n    </html>\n  ");
});

exports["default"] = router;
module.exports = exports["default"];