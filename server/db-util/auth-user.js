const co = require("co");
const knex = require("../knex");
const bcrypt = require("../util/bcrypt-promise");
const getUserByName = require("./get-user-by-name");

module.exports = co.wrap(function* (username, password) {
  const user = yield getUserByName(username);
  const isPasswordCorrect = yield bcrypt.compare(password, user.password);

  return isPasswordCorrect ? user : null;
});
