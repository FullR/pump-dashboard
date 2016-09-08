const knex = require("../knex");

module.exports = (manual=false) => knex("pump-times").where({manual})
  .then((rows) => {
    // convert pumpTime into a date
    return rows.map((row) => Object.assign({}, row, {
      pumpTime: new Date(row.pumpTime)
    }))
  });
