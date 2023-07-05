import express, { Express } from "express";
import exampleRouter from "./modules/example/router.js";
import authRouter from "./modules/googleApi/router.js";
import groupRouter from "./modules/group/router.js";

export default function () {
  const app: Express = express();

  /**
   * Register all available modules
   * <modules>/router.ts
   */
  app.use("/v1/examples", exampleRouter);
  app.use("/v1/auth", authRouter);
  
  app.use("/v1/groups", groupRouter);

  return app;
}
