const knex = require("../knex");

module.exports = (username) => knex("users").where({username}).first();
