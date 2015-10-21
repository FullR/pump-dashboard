"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var s = "\\s+";
var ipMatch = "\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}";
var parseIp = function parseIp(s) {
  return s.split(".").map(function (c) {
    return parseInt(c);
  });
};

function getDeviceRegExp(device) {
  var deviceMatch = "[^#]iface" + s + device + s + "inet" + s + "(static|dhcp|manual)";
  var staticMatch = "address" + s + "(" + ipMatch + ")" + s + "netmask" + s + "(" + ipMatch + ")" + s + "gateway" + s + "(" + ipMatch + ")";
  var manualMatch = "(up|down)" + s + "(.*)" + s + "(up|down)" + s + "(.*)";

  return new RegExp("" + deviceMatch + s + "(?:(?:" + staticMatch + ")|(?:" + manualMatch + "))?");
}

function parseInterface(ifaceData, device) {
  var deviceRegExp = getDeviceRegExp(device);
  var match = ifaceData.match(deviceRegExp);
  var type = undefined;

  if (!match) {
    throw new Error("device not found or malformed interfaces string");
  } else {
    type = match[1];
  }

  switch (type) {
    case "manual":
      return {
        type: type,
        up: match[6],
        down: match[8]
      };
    case "static":
      return {
        type: type,
        address: parseIp(match[2]),
        netmask: parseIp(match[3]),
        gateway: parseIp(match[4])
      };
    default:
      return { type: type };
  }
}

function replaceInterface(ifaceData, device, _ref) {
  var _ref$type = _ref.type;
  var type = _ref$type === undefined ? "dhcp" : _ref$type;
  var address = _ref.address;
  var netmask = _ref.netmask;
  var gateway = _ref.gateway;
  var up = _ref.up;
  var down = _ref.down;

  var deviceRegExp = getDeviceRegExp(device);
  if (type === "dhcp") {
    return ifaceData.replace(deviceRegExp, function () {
      return "\n\niface " + device + " inet dhcp";
    });
  } else if (type === "static") {
    return ifaceData.replace(deviceRegExp, function () {
      return "\n\niface " + device + " inet static\n  address " + address.join(".") + "\n  netmask " + netmask.join(".") + "\n  gateway " + gateway.join(".");
    });
  } else if (type === "manual") {
    return ifaceData.replace(deviceRegExp, function () {
      return "\n\niface " + device + " inet manual\n  up " + up + "\n  down " + down;
    });
  } else {
    throw new Error("Unrecoginzed interface type: " + type);
  }
}

exports["default"] = { parseInterface: parseInterface, replaceInterface: replaceInterface };
module.exports = exports["default"];