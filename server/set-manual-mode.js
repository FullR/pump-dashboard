const co = require("co");
const log = require("./log");
const config = require("./config");
const pumpManager = require("./pump-manager");
const pumpLoop = require("./pump-loop");

module.exports = co.wrap(function* setManualMode(manual) {
  manual = !!manual;
  if(pumpManager.isPumping()) {
    log.error("User attempted to change scheduling mode during pump. This is not allowed");
    return Promise.reject(new Error("Cannot change scheduling settings during pump job"));
  }
  config.set("manual", manual);
  pumpLoop.restart();
});
