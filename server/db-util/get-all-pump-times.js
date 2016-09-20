const knex = require("../knex");

module.exports = () => knex("pump-times").select()
  .then((rows) => {
    // convert pumpTime into a date
    return rows.map((row) => Object.assign({}, row, {
      pumpTime: new Date(row.pumpTime)
    }))
  });
