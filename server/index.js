import server from "./server";
import {Observable} from "rx";
import {log} from "./log-manager";
import scheduleManager from "./schedule-manager";

server(8080)
  .then(() => {
    log("info", "Server started successfully");
  })
  .catch((error) => {
    log("error", `Failed to start server: ${error.message}`);
  });


scheduleManager.start();
