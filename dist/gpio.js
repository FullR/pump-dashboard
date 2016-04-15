"use strict";

var fs = require("fs");
var exec = require("child_process").exec;
var readFile = fs.readFile;
var stat = fs.stat;
var validDirections = ["high", "low", "in", "out"];

function fileExists(filename) {
  return new Promise(function (resolve) {
    stat(filename, function (error) {
      if (error) resolve(false);else resolve(true);
    });
  });
}

function pinDir(pinId) {
  return "/sys/class/gpio/gpio" + pinId;
}

function pinFile(pinId, filename) {
  return pinDir(pinId) + "/" + filename;
}

function readPinFile(pinId, filename) {
  return new Promise(function (resolve, reject) {
    readFile(pinFile(pinId, filename), function (error, result) {
      if (error) {
        reject(error);
      } else {
        resolve(result.toString());
      }
    });
  });
}

function runPinUtil(pinId, command, arg) {
  return new Promise(function (resolve, reject) {
    exec("./pin.exe " + pinId + " " + command + " " + arg, function (error, stdout, stderr) {
      if (error) {
        reject(error);
      } else {
        resolve({ stdout: stdout, stderr: stderr });
      }
    });
  });
}

function setPinValue(pinId, value) {
  return runPinUtil(pinId, "set-value", value ? "1" : "0");
}

function setPinDirection(pinId, direction) {
  if (validDirections.indexOf(direction) === -1) throw new Error("Invalid pin direction: " + direction);
  return runPinUtil(pinId, "set-direction", direction);
}

function setPinActiveLow(pinId, value) {
  return runPinUtil(pinId, "set-active-low", value ? "1" : "0");
}

function exportPin(pinId) {
  return runPinUtil(pinId, "export");
}

function unexportPin(pinId) {
  return runPinUtil(pinId, "unexport");
}

function isPinExported(pinId) {
  return fileExists(pinDir(pinId));
}

function getPinValue(pinId) {
  return readPinFile(pinId, "value").then(function (result) {
    return parseInt(result);
  });
}

function watchPin(pinId, listener) {
  var timeout;
  var prevValue = null;

  function loop() {
    getPinValue(pinId).then(function (result) {
      if (result !== prevValue) {
        listener(result, prevValue);
        prevValue = result;
      }
      timeout = setTimeout(loop, 100);
    });
  }

  loop();
  return function () {
    return clearTimeout(timeout);
  };
}

function setupPin(pinId, direction) {
  return isPinExported(pinId).then(function (isExported) {
    return isExported ? unexportPin(pinId) : Promise.resolve();
  }).then(function () {
    return exportPin(pinId);
  }).then(function () {
    return setPinDirection(pinId, direction);
  });
}

function setupOutputPin(pinId, value) {
  return setupPin(pinId, value ? "high" : "low");
}

function setupInputPin(pinId, activeLow) {
  return setupPin(pinId, "in").then(function () {
    return setPinActiveLow(pinId, activeLow);
  });
}

module.exports = {
  exportPin: exportPin,
  unexportPin: unexportPin,
  setPinValue: setPinValue,
  setPinDirection: setPinDirection,
  setPinActiveLow: setPinActiveLow,
  getPinValue: getPinValue,
  watchPin: watchPin,
  setupPin: setupPin,
  setupOutputPin: setupOutputPin,
  setupInputPin: setupInputPin
};