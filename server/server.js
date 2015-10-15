import express from "express";
import passport from "passport";
import applyMiddleware from "./middleware";
import api from "./api";

export default function startServer(port) {
  return new Promise((resolve, reject) => {
    const app = express();
    applyMiddleware(app);
    app.use(api);
    app.listen(port, (error) => {
      if(error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}
