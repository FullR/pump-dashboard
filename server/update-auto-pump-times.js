const co = require("co");
const downloadHighTideTimes = require("./download-high-tide-times");
const insertPumpTimes = require("./db-util/insert-pump-times");
const log = require("./log");
const config = require("./config");

// downloads high tide times, removes pre-pump delay, filters times before now, and stores times in the database
module.exports = co.wrap(function* () {
  log.info("Downloading tide data from NOAA");
  const highTideTimes = yield downloadHighTideTimes({stationId: config.get("noaaStationId")});
  const pumpTimes = highTideTimes
    .map((highTideTime) => new Date(highTideTime.getTime() - config.get("prePumpDelay")));
  log.info(`Tide data downloaded successfully (${pumpTimes.length} high tides)`, pumpTimes.join("\n"));

  return yield insertPumpTimes(pumpTimes, false);
});
