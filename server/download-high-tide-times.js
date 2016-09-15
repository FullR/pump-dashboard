const request = require("request");
const {writeFile, readFile} = require("fs-promise");

const isoStringMSRegex = /\.\d\d\dZ$/; // needed to remove milliseconds from date#toISOString
const lowTideRegex = /,L,/; // for filtering low tide entries
const lineRegex = /,(\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\dZ)/; // for capturing tide entry times
const noaaErrorRegex = /<ExceptionText>(.*)<\/ExceptionText>/;
const baseUrl = "http://opendap.co-ops.nos.noaa.gov/ioos-dif-sos/SOS";
const oneMonth = (1000 * 60 * 60 * 24 * 30);
const noop = () => {};
const cacheFile = __dirname + "/../cached-noaa-data.csv";

function loadTimesFromCacheFile() {
  return readFile(cacheFile)
    .then((data) => parseHighTideData(data.toString()));
}

module.exports = function downloadHighTideTimes({
  startTime=Date.now(),
  endTime=Date.now() + oneMonth,
  log=noop,
  logError=noop,
  stationId
}={}) {
  if(!stationId) return Promise.reject("downloadHighTideTimes requires stationId option");
  //return loadTimesFromCacheFile(); // for offline testing

  return new Promise((resolve, reject) => {
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
    log(`Requesting NOAA tide data from station ${stationId}`);
    const req = request.get(url, (error, res, body) => {
      if(error) {
        logError(`NOAA request failed: ${error}`);
        reject(error);
      } else {
        log("NOAA Request suceeded");
        writeFile(cacheFile, body)
          .catch((error) => logError(`Failed to cache NOAA response: ${error}`));
        resolve(body);
      }
    });
  }).then(parseHighTideData);
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
  return match ? new Date(match[1]) : null;
}

function getNOAAExceptionText(data) {
  const matched = data.replace(/\n|\r/, "").match(noaaErrorRegex);

  if(matched && matched.length) return matched[1];
  return "Unknown NOAA error: " + data.replace(/\n|\r/, "");
}

function getEventTime(start, end) {
  return (new Date(start)).toISOString().replace(isoStringMSRegex, "Z") + "/" + (new Date(end)).toISOString().replace(isoStringMSRegex, "Z");
}
