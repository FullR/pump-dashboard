"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getHighTideTimes;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _request = require("request");

var _request2 = _interopRequireDefault(_request);

var _rx = require("rx");

// test request: http://opendap.co-ops.nos.noaa.gov/ioos-dif-sos/SOS?service=SOS&request=GetObservation&version=1.0.0&observedProperty=sea_surface_height_amplitude_due_to_equilibrium_ocean_tide&offering=urn:ioos:station:NOAA.NOS.CO-OPS:9432780&responseFormat=text%2Fcsv&eventTime=2013-03-06T00:00:00Z/2013-03-12T23:59:00Z&result=VerticalDatum%3D%3Durn:ioos:def:datum:noaa::MLLW&dataType=HighLowTidePredictions&unit=Meters
var isoStringMSRegex = /\.\d\d\dZ$/; // needed to remove milliseconds from date#toISOString
var lowTideRegex = /,L,/; // for filtering low tide entries
var lineRegex = /,(\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\dZ)/; // for capturing tide entry times
var noaaErrorRegex = /<ExceptionText>(.*)<\/ExceptionText>/;
var baseUrl = "http://opendap.co-ops.nos.noaa.gov/ioos-dif-sos/SOS";
var oneMonth = 1000 * 60 * 60 * 24 * 30;

function getHighTideTimes() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref$startTime = _ref.startTime;
  var startTime = _ref$startTime === undefined ? Date.now() : _ref$startTime;
  var _ref$endTime = _ref.endTime;
  var endTime = _ref$endTime === undefined ? Date.now() + oneMonth : _ref$endTime;
  var stationId = _ref.stationId;

  return _rx.Observable.create(function (observer) {
    var params = ["service=SOS", "request=GetObservation", "version=1.0.0", "observedProperty=sea_surface_height_amplitude_due_to_equilibrium_ocean_tide", "offering=urn:ioos:station:NOAA.NOS.CO-OPS:" + stationId, "responseFormat=text%2Fcsv", "eventTime=" + getEventTime(startTime, endTime), "result=VerticalDatum%3D%3Durn:ioos:def:datum:noaa::MLLW", "dataType=HighLowTidePredictions", "unit=Meters"];
    var url = baseUrl + "?" + params.join("&");
    var req = _request2["default"].get(url, function (error, res, body) {
      if (error) {
        observer.onError(error);
      } else {
        observer.onNext(body);
        observer.onCompleted();
      }
    });

    return function () {
      return req.abort();
    };
  }).map(parseHighTideData);
}

function parseHighTideData(data) {
  if (data.match(/<ExceptionReport/)) {
    throw new Error("NOAA Exception: " + getNOAAExceptionText(data));
  } else if (data.match(/503 Service Unavailable/)) {
    throw new Error("NOAA Service Unavailable");
  }
  return data.trim().split("\n").slice(1).filter(function (line) {
    return !line.match(lowTideRegex);
  }) // remove low tides
  .map(parseNOAATimestamp).filter(function (timestamp) {
    return !!timestamp;
  });
}

function parseNOAATimestamp(line) {
  var match = line.match(lineRegex);
  return match ? new Date(match[1]).getTime() : null;
}

function getNOAAExceptionText(data) {
  var matched = data.replace(/\n|\r/, "").match(noaaErrorRegex);

  if (matched && matched.length) return matched[1];
  return "Unknown NOAA error: " + data.replace(/\n|\r/, "");
}

function getEventTime(start, end) {
  return new Date(start).toISOString().replace(isoStringMSRegex, "Z") + "/" + new Date(end).toISOString().replace(isoStringMSRegex, "Z");
}
module.exports = exports["default"];