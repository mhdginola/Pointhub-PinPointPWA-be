import express, { Express } from "express";
import exampleRouter from "./modules/example/router.js";
import authRouter from "./modules/googleApi/router.js";

export default function () {
  const app: Express = express();

  /**
   * Register all available modules
   * <modules>/router.ts
   */
  app.use("/v1/examples", exampleRouter);
  app.use("/v1/auth", authRouter);

  return app;
}
