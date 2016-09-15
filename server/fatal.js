const log = require("./log");
const exit = () => process.exit();

function fatal(message, error) {
  return log.error(`${message}: ${error}`).then(exit, exit);
}

fatal.email = (message, error) => {
  console.log("Fatal email", error.stack);
  return log.email.error(message, error && error.stack ? error.stack : null).then(exit, exit);
};

module.exports = fatal;
