"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

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
  res.json({});
}).post(_auth2["default"], function (req, res) {
  res.end();
});

router.route("/api/settings").get(_auth2["default"], function (req, res) {
  res.json(_settingManager2["default"].stream.getValue());
}).post(_auth2["default"], function (req, res) {
  _settingManager2["default"].update(req.body);
  res.end();
});

router.route("/api/logs").get(_auth2["default"], function (req, res) {
  res.json(_logManager2["default"].getLogs());
});

router.get("/", function (req, res) {
  var user = req.user || {};
  res.set("Content-Type", "text/html").end("\n    <!doctype html>\n    <html>\n    <head>\n      <title>SmartPump</title>\n    </head>\n    <body>\n      <script type=\"text/javascript\">\n        window.USER = " + (req.isAuthenticated() ? JSON.stringify(user, null, 2) : null) + ";\n      </script>\n      <script src=\"app.js\" type=\"text/javascript\"></script>\n    </body>\n    </html>\n  ");
});

exports["default"] = router;
module.exports = exports["default"];