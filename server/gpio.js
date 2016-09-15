const fs = require("fs");
const path = require("path");
const exec = require("child_process").exec;
const readFile = fs.readFile;
const stat = fs.stat;
const validDirections = ["high", "low", "in", "out"];
const gpioExe = path.join(__dirname, "gpio.exe");
const gpioPath = process.env.BEAGLEBONE === "true" ? "/sys/class/gpio" : path.resolve(__dirname + "/../bbb-gpio-util/test-gpio");

function fileExists(filename) {
  return new Promise((resolve) => {
    stat(filename, (error) => {
      if(error) resolve(false);
      else resolve(true);
    });
  });
}

function pinDir(pinId) {
  return `${gpioPath}/gpio${pinId}`;
}

function pinFile(pinId, filename) {
  return `${pinDir(pinId)}/${filename}`;
}

function readPinFile(pinId, filename) {
  return new Promise((resolve, reject) => {
    readFile(pinFile(pinId, filename), (error, result) => {
      if(error) {
        reject(error);
      } else {
        resolve(result.toString());
      }
    });
  });
}

function runPinUtil(pinId, command, arg) {
  return new Promise((resolve, reject) => {
    exec(`${gpioExe} ${pinId} ${command} ${arg}`, (error, stdout, stderr) => {
      if(error) {
        reject(error);
      } else {
        resolve({stdout: stdout, stderr: stderr});
      }
    });
  });
}

function setPinValue(pinId, value) {
  return runPinUtil(pinId, "set-value", value ? "1" : "0");
}

function setPinDirection(pinId, direction) {
  if(validDirections.indexOf(direction) === -1) throw new Error(`Invalid pin direction: ${direction}`);
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
  return readPinFile(pinId, "value")
    .then((result) => parseInt(result));
}

function watchPin(pinId, listener) {
  var timeout;
  var prevValue = null;

  function loop() {
    getPinValue(pinId).then((result) => {
      if(result !== prevValue) {
        listener(result, prevValue);
        prevValue = result;
      }
      timeout = setTimeout(loop, 100);
    });
  }

  loop();
  return () => clearTimeout(timeout);
}

function setupPin(pinId, direction) {
  return isPinExported(pinId)
    .then((isExported) => isExported ? unexportPin(pinId) : Promise.resolve())
    .then(() => exportPin(pinId))
    .then(() => setPinDirection(pinId, direction));
}

function setupOutputPin(pinId, value) {
  return setupPin(pinId, value ? "high" : "low");
}

function setupInputPin(pinId, activeLow) {
  return setupPin(pinId, "in")
    .then(() => setPinActiveLow(pinId, activeLow));
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
