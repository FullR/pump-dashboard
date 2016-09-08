const co = require("co");
const getUserByName = require("./get-user-by-name");
const createUser = require("./create-user");

module.exports = co.wrap(function* (username, password) {
  const user = yield getUserByName(username);

  if(user) {
    return yield Promise.resolve(user);
  } else {
    return yield createUser(username, password);
  }
});
