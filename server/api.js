import express from "express";
import passport from "passport";
import auth from "./auth";

const router = express.Router();
export default router;

router.route("/api/login").post(passport.authenticate("local-login"), (req, res) => {
  res.end();
});

router.get("/api/logout", (req, res) => {
  req.logout();
  res.end();
});

router.get("/api/schedule", auth, (req, res) => {
  res.json({
    manual: false,
    pumpSchedule: [
      {timestamp: Date.now() + Math.floor(Math.random() * 10000000)},
      {timestamp: Date.now() + Math.floor(Math.random() * 10000000)},
      {timestamp: Date.now() + Math.floor(Math.random() * 10000000)},
      {timestamp: Date.now() + Math.floor(Math.random() * 10000000)},
      {timestamp: Date.now() + Math.floor(Math.random() * 10000000)},
      {timestamp: Date.now() + Math.floor(Math.random() * 10000000)},
      {timestamp: Date.now() + Math.floor(Math.random() * 10000000)},
      {timestamp: Date.now() + Math.floor(Math.random() * 10000000)},
      {timestamp: Date.now() + Math.floor(Math.random() * 10000000)},
      {timestamp: Date.now() + Math.floor(Math.random() * 10000000)},
      {timestamp: Date.now() + Math.floor(Math.random() * 10000000)},
      {timestamp: Date.now() + Math.floor(Math.random() * 10000000)}
    ]
  });
});

router.get("/api/settings", auth, (req, res) => {
  res.json({
    dynamic: true,
    ip: [192, 168, 1, 1],
    subnet: [255,255,255,0],
    gateway: [192, 168, 1, 2],
    closeValvesTimeout: 10000,
    primeTimeout: 20000,
    pumpTimeout: 30000,
    primeDelay: 40000,
    pressureMonitorDelay: 50000,
    postPumpValveDelay: 60000
  }).end();
});

router.get("/api/logs", auth, (req, res) => {
  res.json([
    {timestamp: Date.now() - 327731, level: "info", message: "System initialized"},
    {timestamp: Date.now() - 318442, level: "info", message: "Downloading data"},
    {timestamp: Date.now() - 248913, level: "info", message: "Scheduling pump job"},
    {timestamp: Date.now() - 901134, level: "warning", message: "Too much jet fuel"},
    {timestamp: Date.now() - 185895, level: "info", message: "Starting pumps"},
    {timestamp: Date.now() - 901836, level: "error", message: "System caught fire"},
    {timestamp: Date.now() - 328937, level: "info", message: "System initialized"},
    {timestamp: Date.now() - 314948, level: "info", message: "Downloading data"},
    {timestamp: Date.now() - 248919, level: "info", message: "Scheduling pump job"},
    {timestamp: Date.now() - 902830, level: "warning", message: "Too much jet fuel"},
    {timestamp: Date.now() - 186411, level: "info", message: "Starting pumps"},
    {timestamp: Date.now() - 908812, level: "error", message: "System caught fire"},
    {timestamp: Date.now() - 324913, level: "info", message: "System initialized"},
    {timestamp: Date.now() - 311914, level: "info", message: "Downloading data"},
    {timestamp: Date.now() - 248915, level: "info", message: "Scheduling pump job"},
    {timestamp: Date.now() - 904816, level: "warning", message: "Too much jet fuel"},
    {timestamp: Date.now() - 186417, level: "info", message: "Starting pumps"},
    {timestamp: Date.now() - 901818, level: "error", message: "System caught fire"},
  ]);
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