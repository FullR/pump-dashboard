module.exports = require("knex")({
  client: "postgres",
  connection: {
    host     : "127.0.0.1",
    user     : "postgres",
    password : "foobar321",
    database : "pump-manager",
    charset  : "utf8"
  }
});
