const passport = require("./passport");
const log = require("./log");

module.exports = () => {
  const passport = require("passport");
  const express = require("express");
  const router = express.Router();
  const auth = passport.authenticate("local");

  router.post("/login", auth, (req, res) => {
    log(`User ${req.user.username} logged in successfully`);
    res.json({success: true, user: req.user});
  });

  return router;
};
