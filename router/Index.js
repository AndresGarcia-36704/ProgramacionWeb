import express from "express";
import { usersFileRouter } from "./Users.file.router.js";

const router = express.Router();

export function routerUsers(app) {
  app.use("/api/V1", router);

  router.use("/file/users", usersFileRouter);
}
