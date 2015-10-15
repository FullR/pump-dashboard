import request from "request";
import {Observable} from "rx";
// test request: http://opendap.co-ops.nos.noaa.gov/ioos-dif-sos/SOS?service=SOS&request=GetObservation&version=1.0.0&observedProperty=sea_surface_height_amplitude_due_to_equilibrium_ocean_tide&offering=urn:ioos:station:NOAA.NOS.CO-OPS:9432780&responseFormat=text%2Fcsv&eventTime=2013-03-06T00:00:00Z/2013-03-12T23:59:00Z&result=VerticalDatum%3D%3Durn:ioos:def:datum:noaa::MLLW&dataType=HighLowTidePredictions&unit=Meters
const isoStringMSRegex = /\.\d\d\dZ$/; // needed to remove milliseconds from date#toISOString
const lowTideRegex = /,L,/; // for filtering low tide entries
const lineRegex = /,(\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\dZ)/; // for capturing tide entry times
const noaaErrorRegex = /<ExceptionText>(.*)<\/ExceptionText>/;
const baseUrl = "http://opendap.co-ops.nos.noaa.gov/ioos-dif-sos/SOS";
const oneMonth = (1000 * 60 * 60 * 24 * 30);

export default function getHighTideTimes({
  startTime = Date.now(),
  endTime = Date.now() + oneMonth,
  stationId
} = {}) {
  return Observable.create((observer) => {
    const params = [
      "service=SOS",
      "request=GetObservation",
      "version=1.0.0",
      "observedProperty=sea_surface_height_amplitude_due_to_equilibrium_ocean_tide",
      `offering=urn:ioos:station:NOAA.NOS.CO-OPS:${stationId}`,
      "responseFormat=text%2Fcsv",
      `eventTime=${getEventTime(startTime, endTime)}`,
      "result=VerticalDatum%3D%3Durn:ioos:def:datum:noaa::MLLW",
      "dataType=HighLowTidePredictions",
      "unit=Meters"
    ];
    const url = `${baseUrl}?${params.join("&")}`;
    const req = request.get(url, (error, res, body) => {
      if(error) {
        observer.onError(error);
      } else {
        observer.onNext(body);
        observer.onCompleted();
      }
    });

    return () => req.abort();
  }).map(parseHighTideData);
}

function parseHighTideData(data) {
  if(data.match(/<ExceptionReport/)) {
    throw new Error(`NOAA Exception: ${getNOAAExceptionText(data)}`);
  } else if(data.match(/503 Service Unavailable/)) {
    throw new Error("NOAA Service Unavailable");
  }
  return data
    .trim()
    .split("\n")
    .slice(1)
    .filter((line) => !line.match(lowTideRegex)) // remove low tides
    .map(parseNOAATimestamp)
    .filter((timestamp) => !!timestamp);
}

function parseNOAATimestamp(line) {
  const match = line.match(lineRegex);
  return match ? (new Date(match[1])).getTime() : null;
}

function getNOAAExceptionText(data) {
  const matched = data.replace(/\n|\r/, "").match(noaaErrorRegex);

  if(matched && matched.length) return matched[1];
  return "Unknown NOAA error: " + data.replace(/\n|\r/, "");
}

function getEventTime(start, end) {
  return (new Date(start)).toISOString().replace(isoStringMSRegex, "Z") + "/" + (new Date(end)).toISOString().replace(isoStringMSRegex, "Z");
}
