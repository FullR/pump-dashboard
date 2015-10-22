import express from "express";
import passport from "passport";
import auth from "./auth";

import logManager from "./log-manager";
import settingManager from "./setting-manager";
import scheduleManager from "./schedule-manager";
import pumpManager from "./pump-manager";

const {log} = logManager;
const router = express.Router();

router.route("/api/login").post(passport.authenticate("local-login"), (req, res) => {
  res.end();
});

router.get("/api/logout", (req, res) => {
  req.logout();
  res.end();
});

router.route("/api/schedule")
  .get(auth, (req, res) => {
    res.json({
      ...scheduleManager.model, 
      preTideDelay: settingManager.model.preTideDelay
    });
  })
  .post(auth, (req, res) => {
    const {manual, manualSchedule} = req.body;
    log("info", "Received schedule settings from web client");

    if(req.body && req.body.manual) {
      if(manualSchedule.some((t) => typeof t !== "number")) {
        res.status(400).json({error: "Invalid times"});
      } else {
        scheduleManager.enableManual(manualSchedule);
        res.end();
      }
    } else {
      res.end();
    }
  });

router.route("/api/settings")
  .get(auth, (req, res) => {
    res.json(settingManager.model);
  })
  .post(auth, (req, res) => {
    settingManager.set(req.body);
    res.end();
  });

router.route("/api/logs")
  .get(auth, (req, res) => {
    res.json(logManager.getLogs());
  });

router.route("/api/pump")
  .post(auth, (req, res) => {
    log("info", "Received manual pump signal from client. Starting pump cycle");
    pumpManager.start()
      .then(() => {
        log("info", "Pumping completed");
      })
      .catch((error) => {
        log("error", `Pumping failed: ${error.message}`);
      });

    res.end();
  });

router.get("/", (req, res) => {
  const user = req.user || {};
  const isAuthenticated = req.isAuthenticated();
  res.set("Content-Type", "text/html").end(`
    <!doctype html>
    <html>
    <head>
      <title>SmartPump</title>
    </head>
    <body>
      <script type="text/javascript">
        window.USER = ${isAuthenticated ? JSON.stringify(user, null, 2) : null};
      </script>
      <script src="app.js" type="text/javascript"></script>
    </body>
    </html>
  `);
});

export default router;
