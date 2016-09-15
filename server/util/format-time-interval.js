const {entries} = require("lodash");
const tc = require("../time-constants");

const intervals = ["MONTH", "DAY", "HOUR", "MINUTE"];

// takes a number of milliseconds and formats it as "x months x days x hours x minutes" omiting any that are 0
module.exports = function formatTimeInterval(ms) {
  return intervals.reduce((s, key, index) => {
    const intervalTime = tc[key];
    const count = index ?
      Math.floor((ms % tc[intervals[index - 1]]) / intervalTime) :
      Math.floor(ms / intervalTime);
    const intervalName = key.toLowerCase();

    if(count <= 0) return s;
    return `${s.length ? s + " " : ""}${count} ${intervalName}${count === 1 ? "" : "s"}`;
  }, "");
}
