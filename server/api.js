import express from "express";
import passport from "passport";
import auth from "./auth";

import logManager from "./log-manager";
import settingManager from "./setting-manager";
import scheduleManager from "./schedule-manager";

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
    res.json(scheduleManager.stream.getValue());
  })
  .post(auth, (req, res) => {
    console.log("Received schedule from client:", req.body);
    const {manual, manualSchedule} = req.body;
    if(req.body && req.body.manual) {
      if(manualSchedule.some((t) => typeof t !== "number")) {
        res.status(400).json({error: "Invalid times"});
      } else {
        scheduleManager.enableManualMode(manualSchedule);
        res.end();
      }
    } else {
      res.end();
    }
  });

router.route("/api/settings")
  .get(auth, (req, res) => {
    res.json(settingManager.stream.getValue());
  })
  .post(auth, (req, res) => {
    settingManager.update(req.body);
    res.end();
  });

router.route("/api/logs")
  .get(auth, (req, res) => {
    res.json(logManager.getLogs());
  });

router.get("/", (req, res) => {
  const user = req.user || {};
  res.set("Content-Type", "text/html").end(`
    <!doctype html>
    <html>
    <head>
      <title>SmartPump</title>
    </head>
    <body>
      <script type="text/javascript">
        window.USER = ${req.isAuthenticated() ? JSON.stringify(user, null, 2) : null};
      </script>
      <script src="app.js" type="text/javascript"></script>
    </body>
    </html>
  `);
});

export default router;
