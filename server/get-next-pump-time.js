const co = require("co");
const getPumpTimes = require("./db-util/get-pump-times");
const updateAutoPumpTimes = require("./update-auto-pump-times");
const log = require("./log");

function filterOld(pumpTimes) {
  const now = Date.now();
  return pumpTimes.filter((pumpTime) => pumpTime.getTime() < now);
}

const getNextAutomaticPumpTime = co.wrap(function* () {
  const pumpTimes = (yield getPumpTimes(false)).map((row) => row.pumpTime);
  const validPumpTimes = filterOld(pumpTimes);
  if(validPumpTimes.length) {
    return validPumpTimes.sort()[0];
  } else {
    log("No valid automatic pump times found. Downloading new tide data.");
    yield updateAutoPumpTimes();
    return yield getAutomaticPumpTimes();
  }
});

const getNextManualPumpTime = co.wrap(function* () {
  const pumpTimes = (yield getPumpTimes(false)).map((row) => row.pumpTime);
  const validPumpTimes = filterOld(pumpTimes);
  if(validPumpTimes.length) {
    return validPumpTimes.sort()[0];
  } else {
    throw new Error(`No manual pump times found. Add some using the web interface and restart the server.`);
  }
}

module.exports = function getNextPumpTime(manual) {
  return manual ?
    getNextManualPumpTime() :
    getNextAutomaticPumpTime();
}
