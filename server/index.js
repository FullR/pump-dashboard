const apiServer = require("./api-server");
const devServer = require("./dev-server");
const setupDBTables = require("./setup-db-tables");
const createUserIfNotExists = require("./db-util/create-user-if-not-exists");
const updateAutoPumpTimes = require("./update-auto-pump-times");
const startPumpLoop = require("./start-pump-loop");
const log = require("./log");
const config = require("../config");

// to avoid storing the password on github, it will be passed as an environmental variable
if(!process.env.PUMP_EMAIL_PASSWORD) {
  console.log('Error: You must define an environmental variable for the email password. Example: export PUMP_EMAIL_PASSWORD="email password"');
  process.exit();
}

const PORT = process.env.PORT || 8080;
const PROD = process.env.NODE_ENV === "production";

function startServers() {
  if(PROD) {
    return apiServer(PORT);
  } else {
    return Promise.all(
      apiServer(PORT - 1),
      devServer(PORT, PORT - 1)
    );
  }
}

function createAdminUser() {
  return createUserIfNotExists("admin", config.defaultAdminPassword);
}

setupDBTables()
  .then(createAdminUser)
  .then(startServers).catch(() => {}) // if the web server fails, the system should continue
  .then(() => {
    if(!config.manual) {
      return updateAutoPumpTimes();
    }
  })
  .then(log.startClearLoop) // clear old logs once a week
  .then(startPumpLoop)
  .catch(console.log.bind(console));
