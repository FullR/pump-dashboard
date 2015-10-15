"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = applyMiddleware;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _cookieParser = require("cookie-parser");

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _morgan = require("morgan");

var _morgan2 = _interopRequireDefault(_morgan);

var _expressSession = require("express-session");

var _expressSession2 = _interopRequireDefault(_expressSession);

var _passport = require("passport");

var _passport2 = _interopRequireDefault(_passport);

var _passportLocal = require("passport-local");

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var LOGIN = {
  username: "admin",
  password: "password"
};

function applyMiddleware(app) {
  app.use((0, _morgan2["default"])("dev"));
  app.use(_bodyParser2["default"].json());
  app.use(_bodyParser2["default"].urlencoded({ extended: true }));
  app.use((0, _cookieParser2["default"])());
  app.use((0, _expressSession2["default"])({
    secret: "fj890fj89wj890js0uajk9rj0q",
    resave: false,
    saveUninitialized: false
  }));
  app.use(_passport2["default"].initialize());
  app.use(_passport2["default"].session());
  //console.log(__dirname);
  app.use(_express2["default"]["static"](_path2["default"].resolve(__dirname + "/public")));

  _passport2["default"].serializeUser(function (user, done) {
    done(null, user);
  });

  _passport2["default"].deserializeUser(function (user, done) {
    done(null, user);
  });

  _passport2["default"].use("local-login", new _passportLocal.Strategy({
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true
  }, function (req, username, password, done) {
    console.log("Checking", username, password);
    if (username === LOGIN.username && password === LOGIN.password) {
      done(null, { username: username });
    } else {
      done(new Error("Invalid username or password"));
    }
  }));
}

module.exports = exports["default"];