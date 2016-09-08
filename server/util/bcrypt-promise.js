const bcrypt = require("bcrypt-nodejs");

module.exports = {
  hash(data) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(data, null, null, (error, hash) => error ? reject(error) : resolve(hash));
    });
  },

  compare(data, hash) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(data, hash, (error, matches) => error ? reject(error) : resolve(matches))
    });
  }
};
