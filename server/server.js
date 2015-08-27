import express from "express";
import passport from "passport";
import applyMiddleware from "./middleware";
import getApi from "./api";

export default function startServer(port=9090, apiIO) {
  return new Promise((resolve) => {
    const app = express();
    applyMiddleware(app);
    app.use(getApi(apiIO));
    app.listen(port, () => {
      resolve();
    });
  });
}
