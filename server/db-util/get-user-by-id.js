const knex = require("../knex");

module.exports = (id) => knex("users").where({id}).first();
