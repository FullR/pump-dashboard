const log = require("./log");
const exit = process.exit.bind(process);

module.exports = function fatal(message, error, noEmail) {
  return (noEmail ?
    log.error(`${message}: ${error}`) :
    log.email.error(message, error)
  ).then(exit, exit);
}
