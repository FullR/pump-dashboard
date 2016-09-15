const knex = require("./knex");
const {once} = require("lodash");
const {WEEK} = require("./time-constants");

function insertLogObject(logObj) {
  return knex("logs").insert(logObj)
    .catch((error) => console.log(`Failed to store log in database: ${error}`));
}

function log(level, message) {
  if(arguments.length === 1) {
    message = level;
    level = "info";
  }
  const timestamp = new Date();
  console.log(`[${level}] [${timestamp}]: ${message}`);

  if(level !== "silly") {
    insertLogObject({
      level,
      message
    });
  }
}

log.info = log.bind(null, "info");
log.error = log.bind(null, "error");
log.silly = log.bind(null, "silly");

// once a week, delete all logs that are more than a week old
log.startClearLoop = once(() => {
  setInterval(() => {
    log.silly("Clearing old logs");
    knex("logs")
      .whereRaw("timestamp < now() - interval '1 week'")
      .del()
      .then(() => console.log("Cleared logs"))
      .catch((error) => console.log(`Error clearing logs: ${error}`));
  }, WEEK);
});

module.exports = log;
