"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = formatRemaining;

function formatRemaining(ms) {
  var floor = Math.floor;

  var pluralize = function pluralize(word, n) {
    return n > 1 ? word + "s" : word;
  };

  var seconds = floor(ms / 1000) % 60;
  var minutes = floor(ms / (1000 * 60)) % 60;
  var hours = floor(ms / (1000 * 60 * 60)) % 24;
  var days = floor(ms / (1000 * 60 * 60 * 24));

  if (days) {
    return days + " " + pluralize("day", days) + ", " + hours + " " + pluralize("hour", hours);
  } else if (hours) {
    return hours + " " + pluralize("hour", hours) + ", " + minutes + " " + pluralize("minute", minutes);
  } else if (minutes) {
    return minutes + " " + pluralize("minute", minutes) + ", " + seconds + " " + pluralize("second", seconds);
  } else if (seconds) {
    return seconds + " " + pluralize("second", seconds);
  } else {
    return ms + " " + pluralize("millisecond", ms);
  }
}

module.exports = exports["default"];