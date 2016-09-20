const setupDBTables = require("./setup-db-tables");
const createUserIfNotExists = require("./db-util/create-user-if-not-exists");
const updateAutoPumpTimes = require("./update-auto-pump-times");
const pumpLoop = require("./pump-loop");
const log = require("./log");
const fatal = require("./fatal");
const config = require("./config");

// to avoid storing the password on github, it will be passed as an environmental variable
if(!process.env.PUMP_EMAIL_PASSWORD) {
  log.verbose('Warning: You must define an environmental variable for the email password. Example: export PUMP_EMAIL_PASSWORD="email password"');
}
if(process.env.BEAGLEBONE !== "true") {
  log.verbose('Warning: Beaglebone not detected. BEAGLEBONE environmental variable must be set to "true" for GPIO to function properly. Example: export BEAGLEBONE="true" (Note: for change to be active, you must recompile GPIO utils by running "npm run compile-gpio-util")');
}

const PORT = process.env.PORT || 8080;
const PROD = process.env.NODE_ENV === "production";

function startServers() {
  const apiServer = require("./api-server");
  if(PROD) {
    return apiServer(PORT);
  } else {
    const devServer = require("./dev-server");
    return Promise.all(
      apiServer(PORT - 1),
      devServer(PORT, PORT - 1)
    );
  }
}

function createAdminUser() {
  return createUserIfNotExists("admin", config.get("defaultAdminPassword"));
}

setupDBTables()
  .then(createAdminUser)
  .then(log.enableDatabaseLogging) // keep log module from trying to write to db before its initialized
  .then(startServers).catch(() => {}) // if the web server fails, the system should continue
  .then(() => {
    if(!config.get("manual")) {
      return updateAutoPumpTimes();
    }
  })
  .then(log.startClearLoop) // clear old logs once a week
  .then(pumpLoop.start)
  .catch((error) => {
    fatal.email(`Pump controller crash: ${error}`, error);
  });
