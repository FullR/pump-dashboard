const co = require("co");
const downloadHighTideTimes = require("./download-high-tide-times");
const insertPumpTimes = require("./db-util/insert-pump-times");
const {stationId, prePumpDelay} = require("../config");

// downloads high tide times, removes pre-pump delay, filters times before now, and stores times in the database
module.exports = co.wrap(function* () {
  const highTideTimes = yield downloadHighTideTimes({stationId});
  const pumpTimes = highTideTimes
    .map((highTideTime) => new Date(highTideTime.getTime() - prePumpDelay));

  return yield insertPumpTimes(pumpTimes, false);
});
