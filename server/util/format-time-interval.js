const {entries} = require("lodash");
const tc = require("../time-constants");

const intervals = ["MONTH", "DAY", "HOUR", "MINUTE", "SECOND"];
const intervalKeyMap = intervals.reduce((map, key) => {
  map[key] = key.toLowerCase();
  return map;
}, {});

// takes a number of milliseconds and formats it as "x months x days x hours x minutes" omiting any that are 0
module.exports = function formatTimeInterval(ms) {
  if(!ms || typeof ms !== "number") return "0 milliseconds";
  if(ms < 1000) return `${ms} milliseconds`;
  return intervals.reduce((s, key, index) => {
    const intervalTime = tc[key];
    const count = index ?
      Math.floor((ms % tc[intervals[index - 1]]) / intervalTime) :
      Math.floor(ms / intervalTime);
    const intervalName = intervalKeyMap[key];

    if(count <= 0) return s;
    return `${s.length ? s + " " : ""}${count} ${intervalName}${count === 1 ? "" : "s"}`;
  }, "");
}
