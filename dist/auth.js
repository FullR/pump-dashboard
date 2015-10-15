"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = auth;

function auth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).end();
}

module.exports = exports["default"];