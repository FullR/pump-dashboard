const lt = require("long-timeout");

module.exports = function wait(ms) {
  return new Promise((resolve) => lt.setTimeout(resolve, ms));
};
