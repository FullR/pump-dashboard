const passport = require("./passport");
const log = require("./log");
const pumpManager = require("./pump-manager");
const getAllPumpTimes = require("./db-util/get-all-pump-times");
const insertPumpTimes = require("./db-util/insert-pump-times");
const setManualMode = require("./set-manual-mode");
const config = require("./config");

function auth(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  } else {
    res.status(401).end();
  }
}

module.exports = () => {
  const passport = require("passport");
  const express = require("express");
  const router = express.Router();

  router.post("/login", passport.authenticate("local"), (req, res) => {
    log.info(`User ${req.user.username} logged in successfully`);
    getAllPumpTimes()
      .then((pumpTimes) => {
        res.json({success: true, user: req.user, manual: config.get("manual"), pumpTimes});
      })
      .catch((error) => res.status(400).json({error}));
  });

  router.post("/start-pump", auth, (req, res) => {
    if(pumpManager.isPumping()) {
      log.error("Pump request from web client denied: Pumps are already running");
      res.status(400).json({error: "Pumps are busy"});
    } else {
      log.info("Received pump start request from web client");
      pumpManager.start();
      res.json({success: true});
    }
  });

  router.post("/stop-pump", auth, (req, res) => {
    log.info("Received pump stop request from web client");
    pumpManager.stop();
    res.json({success: true});
  });

  router.post("/set-manual-times", auth, (req, res) => {
    log.info("Received manual pump times from client. Switching to manual scheduling mode.");
    const pumpTimesToInsert = req.body.pumpTimes.filter((pumpTime) => pumpTime.manual).map((pumpTime) => pumpTime.pumpTime);
    insertPumpTimes(pumpTimesToInsert, true)
      .then(() => {
        setManualMode(true);
        res.json({success: true});
      })
      .catch((error) => res.status(400).json({error}))
  });

  router.get("/pump-times", auth, (req, res) => {
    getAllPumpTimes()
      .then((pumpTimes) => res.json(pumpTimes))
      .catch((error) => res.status(400).json({error}));
  });

  return router;
};
