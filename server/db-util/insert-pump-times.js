const co = require("co");
const knex = require("../knex");

module.exports = co.wrap(function*(pumpTimes, manual=false) {
  yield knex("pump-times").where({manual}).del(); // delete old pump times
  const pumpTimeRows = pumpTimes.map((dateTime) => ({
    pumpTime: dateTime,
    manual
  }));

  return yield knex("pump-times").insert(pumpTimeRows);
});
