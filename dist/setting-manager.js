"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _fs = require("fs");

var _path = require("path");

var _settingManagerClass = require("./setting-manager-class");

var _settingManagerClass2 = _interopRequireDefault(_settingManagerClass);

var _interfaceParser = require("./interface-parser");

var _logManager = require("./log-manager");

var local = function local(path) {
  return (0, _path.normalize)((0, _path.join)(__dirname, path));
};
var interfaceDevice = "eth0";
var filename = local("settings.json");
var interfacesFile = local("../test-interfaces");
var interfacesData = undefined;
var settings = undefined;

try {
  settings = JSON.parse((0, _fs.readFileSync)(filename));
} catch (error) {
  (0, _logManager.log)("error", "Failed to load settings from file system: " + error);
  settings = {};
}

try {
  interfacesData = (0, _fs.readFileSync)(interfacesFile).toString();
} catch (error) {
  (0, _logManager.log)("error", "Failed to load network interfaces from file system: " + error);
  interfacesData = "\n# default interfaces data generated by SmartPumps\n\nauto lo\niface lo inet loopback\n\niface " + interfaceDevice + " inet dhcp\n";
}

var settingManager = new _settingManagerClass2["default"](settings);

var _parseInterface = (0, _interfaceParser.parseInterface)(interfacesData, interfaceDevice);

var type = _parseInterface.type;
var address = _parseInterface.address;
var netmask = _parseInterface.netmask;
var gateway = _parseInterface.gateway;

settingManager.set({ auto: type === "dhcp", address: address, netmask: netmask, gateway: gateway });
settingManager.on("change", saveSettings);
settingManager.on("network-change", updateNetworkSettings);

function saveSettings() {
  (0, _logManager.log)("info", "Writing new settings to file system");
  (0, _fs.writeFile)(filename, settingManager.json, function (error) {
    if (error) {
      (0, _logManager.log)("error", "Failed to write settings to file system: " + error.message);
    } else {
      (0, _logManager.log)("info", "Settings successfully written to file system");
    }
  });
}

function updateNetworkSettings() {
  var _settingManager$model = settingManager.model;
  var auto = _settingManager$model.auto;
  var address = _settingManager$model.address;
  var netmask = _settingManager$model.netmask;
  var gateway = _settingManager$model.gateway;

  if (auto) {
    interfacesData = (0, _interfaceParser.replaceInterface)(interfacesData, interfaceDevice, { type: "dhcp" });
  } else {
    interfacesData = (0, _interfaceParser.replaceInterface)(interfacesData, interfaceDevice, { type: "static", address: address, netmask: netmask, gateway: gateway });
  }
  (0, _logManager.log)("info", "Writing network interfaces to file system");
  (0, _fs.writeFile)(interfacesFile, interfacesData, function (error) {
    if (error) {
      (0, _logManager.log)("error", "Failed to write network interfaces to file system: " + error.message);
    } else {
      (0, _logManager.log)("info", "Network interfaces successfully written to file system");
    }
  });
}

exports["default"] = settingManager;
module.exports = exports["default"];