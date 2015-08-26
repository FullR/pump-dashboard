import express from "express";
import passport from "passport";
import applyMiddleware from "./middleware";
import api from "./api";

const app = express();

applyMiddleware(app);
app.use(api);

export default function startServer(port=9090) {
  return new Promise((resolve) => {
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
      resolve();
    });
  });
}

startServer();
