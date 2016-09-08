const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const getUserById = require("./db-util/get-user-by-id");
const authUser = require("./db-util/auth-user");

passport.serializeUser((user, done) => {
  const {id, username} = user;
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  getUserById(userId)
    .then((user) => done(null, user))
    .catch((error) => done(error));
});

passport.use("local", new LocalStrategy({
    usernameField: "username",
    passwordField: "password"
}, (username, password, done) => {
  authUser(username, password)
    .then((user) => {
      done(null, user || false);
    })
    .catch((error) => done(null, error));
}));

module.exports = passport;
