const express = require("express");
const path = require("path");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const passport = require("./passport");
const getAPI = require("./api");
const log = require("./log");

module.exports = (port) => {
  const app = express();
  app.use(express.static(__dirname + "/../build"));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(morgan("dev"));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(cookieParser());
  app.use(session({
    secret: "fj890fj89wj890js0uajk9rj0q",
    resave: false,
    saveUninitialized: false
  }));
  app.use("/api", getAPI());

  app.listen(port, (error) => {
    if(error) {
      log.error(`Webserver failed to start: ${error}`);
    } else {
      log(`Webserver started successfully on port ${port}`);
    }
  });
};
