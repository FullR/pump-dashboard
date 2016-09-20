const {writeFile} = require("fs-promise");
const config = loadConfig();

function loadConfig() {
  try {
    return require("../config");
  } catch(error) {
    console.error("Failed to load config. Using default configuration");
    return require("../default-config");
  }
}

function get(key) {
  return config[key];
}

function set(key, value) {
  if(config[key] !== value) {
    config[key] = value;
    save();
  }
}

function save() {
  return writeFile(__dirname + "/../config.json", JSON.stringify(config, null, 2))
    .catch((error) => log.error(`Failed to save config changes to disk`));
}


module.exports = {get, set, save};
