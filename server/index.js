import "babel/polyfill";
import server from "./server";
import {Observable} from "rx";
import {log} from "./log-manager";
import scheduleManager from "./schedule-manager";
const port = 8080;

server(port)
  .then(() => {
    log("info", `Web server successfully started on port ${port}`);
  })
  .catch((error) => {
    log("error", `Failed to start server: ${error.message}`);
  });

scheduleManager.start();
