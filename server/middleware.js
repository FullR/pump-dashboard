import bodyParser from "body-parser";
import path from "path";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import session from "express-session";
import passport from "passport";
import {Strategy as LocalStrategy} from "passport-local";
import express from "express";

const LOGIN = {
  username: "admin",
  password: "password"
};

export default function applyMiddleware(app) {
  app.use(morgan("dev"));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(cookieParser())
  app.use(session({
    secret: "fj890fj89wj890js0uajk9rj0q",
    resave: false,
    saveUninitialized: false
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  //console.log(__dirname);
  app.use(express.static(path.resolve(__dirname + "/../dist")));

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
      done(null, user);
  });

  passport.use("local-login", new LocalStrategy({
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true
  }, function(req, username, password, done) {
    console.log("Checking",username, password);
    if(username === LOGIN.username && password === LOGIN.password) {
      done(null, {username});
    } else {
      done(new Error("Invalid username or password"));
    }
  }));
}
