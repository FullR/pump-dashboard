const knex = require("./knex");

function users(table) {
  table.increments();
  table.string("username").index().unique();
  table.string("password", 60);
  table.timestamps();
}

function pumpTimes(table) {
  table.increments();
  table.boolean("manual");
  table.dateTime("pumpTime");
}

function logs(table) {
  table.increments();
  table.enu("level", ["info", "error"]);
  table.timestamp("timestamp");
  table.text("message");
}

module.exports = function setupDB() {
  return knex.schema
      .dropTableIfExists("logs")
      .dropTableIfExists("pump-times")
      .dropTableIfExists("users")
      .createTable("logs", logs)
      .createTable("users", users)
      .createTable("pump-times", pumpTimes)
      .then(() => knex);
}
