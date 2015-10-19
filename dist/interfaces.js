"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _child_process = require("child_process");

var _child_process2 = _interopRequireDefault(_child_process);

var _path = require("path");

var _network = require("network");

var _network2 = _interopRequireDefault(_network);

var local = function local(path) {
  return (0, _path.normalize)((0, _path.join)(__dirname, path));
};
var readScript = local("/network-scripts/read-interface.awk");
var writeScript = local("/network-scripts/write-interface.awk");

function execFile(filename, args, options) {
  return new Promise(function (resolve, reject) {
    _child_process2["default"].execFile(filename, args, options, function (error, stdout, stderr) {
      if (error) reject(error);else resolve({ stdout: stdout, stderr: stderr });
    });
  });
}

function read(interfacesPath, interfaceName) {
  return new Promise(function (resolve, reject) {
    _network2["default"].get_interfaces_list(function (error, data) {
      console.log(data);
      if (error) reject(error);else resolve(data);
    });
  });
}

function write(interfaceName) {
  var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var auto = _ref.auto;
  var ip = _ref.ip;
  var subnet = _ref.subnet;
  var gateway = _ref.gateway;
}

exports["default"] = { read: read, write: write };
module.exports = exports["default"];