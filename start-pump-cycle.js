const pumpManager = require("./server/pump-manager");
const wait = require("./server/util/wait");

pumpManager.start()
  .then(() => console.log("Done"))
  .catch((error) => console.log(error))
  .then(() => wait(30000))
  .then(() => process.exit());
