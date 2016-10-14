const setupDBTables = require("./server/setup-db-tables");

setupDBTables()
  .then(() => console.log("Done"))
  .catch((error) => console.log(error))
  .then(() => process.exit());
