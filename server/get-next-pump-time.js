const co = require("co");
const {isNaN} = require("lodash");
const getPumpTimes = require("./db-util/get-pump-times");
const updateAutoPumpTimes = require("./update-auto-pump-times");
const {manual} = require("../config");
const log = require("./log");
const compareDates = (a, b) => a - b;

function filterInvalid(pumpTimes) {
  const now = Date.now();
  return pumpTimes.filter((pumpTime) => pumpTime && pumpTime.getTime() > now);
}

const getNextAutomaticPumpTime = co.wrap(function* () {
  const pumpTimes = (yield getPumpTimes(false)).map((row) => row.pumpTime);
  const validPumpTimes = filterInvalid(pumpTimes);
  if(validPumpTimes.length) {
    return validPumpTimes.sort(compareDates)[0];
  } else {
    log.info("No valid automatic pump times found. Downloading new tide data.");
    yield updateAutoPumpTimes();
    return yield getAutomaticPumpTimes();
  }
});

const getNextManualPumpTime = co.wrap(function* () {
  const pumpTimes = (yield getPumpTimes(true)).map((row) => row.pumpTime);
  const validPumpTimes = filterInvalid(pumpTimes);
  if(validPumpTimes.length) {
    return validPumpTimes.sort(compareDates)[0];
  } else {
    throw new Error(`No manual pump times found. Add some using the web interface and restart the server.`);
  }
});

module.exports = function getNextPumpTime() {
  return manual ?
    getNextManualPumpTime() :
    getNextAutomaticPumpTime();
}
