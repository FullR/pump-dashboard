const apiServer = require("./api-server");
const devServer = require("./dev-server");
const setupDBTables = require("./setup-db-tables");
const createUserIfNotExists = require("./db-util/create-user-if-not-exists");
const updateAutoPumpTimes = require("./update-auto-pump-times");
const log = require("./log");
const config = require("../config");

const PORT = process.env.PORT || 8080;
const PROD = process.env.NODE_ENV === "production";

function startServers() {
  if(PROD) {
    apiServer(PORT);
  } else {
    apiServer(PORT - 1);
    devServer(PORT, PORT - 1);
  }
}

function createAdminUser() {
  return createUserIfNotExists("admin", config.defaultAdminPassword);
}

setupDBTables()
  .then(createAdminUser)
  .then(startServers)
  .then(updateAutoPumpTimes)
  .then(() => log.startClearLoop())
  .catch(console.log.bind(console));
