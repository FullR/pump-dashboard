const knex = require("./knex");
const {once} = require("lodash");
const {WEEK} = require("./time-constants");
const lt = require("long-timeout");
const sendEmail = require("./send-email");

const logLevels = ["verbose", "info", "error"];

function insertLogObject(logObj) {
  return knex("logs").insert(logObj)
    .catch((error) => console.log(`Failed to store log in database: ${error}`));
}

function getLogString(level, message) {
  return `[${level}] [${new Date}]: ${message}`;
}

function log(level, message) {
  if(arguments.length === 1) {
    message = level;
    level = "info";
  }
  console.log(getLogString(level, message));

  if(level !== "verbose") { // no need to store verbose logs
    return insertLogObject({
      level,
      message
    });
  }

  return Promise.resolve();
}

function logAndEmail(level, message, emailText) {
  return Promise.all([
    log(level, message),
    sendEmail(getLogString(level, message), emailText)
  ]);
}

function clearOldLogs() {
  log.verbose("Clearing old logs");
  knex("logs")
    .whereRaw("timestamp < now() - interval '1 week'")
    .del()
    .then(() => console.log("Cleared logs"))
    .catch((error) => console.log(`Error clearing logs: ${error}`));
}

// once a week, delete all logs that are more than a week old
function startClearLoop() {
  lt.setInterval(clearOldLogs, WEEK);
}

log.email = {};

logLevels.forEach((logLevel) => {
  log[logLevel] = log.bind(null, logLevel);
  log.email[logLevel] = logAndEmail.bind(null, logLevel);
});

log.startClearLoop = once(startClearLoop);

module.exports = log;
