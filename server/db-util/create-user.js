const co = require("co");
const knex = require("../knex");
const bcrypt = require("../util/bcrypt-promise");

module.exports = co.wrap(function* (username, password) {
  // put some salt on that password
  const hash = yield bcrypt.hash(password);

  return yield knex("users").insert({
    username,
    password: hash,
    created_at: new Date
  });
});
