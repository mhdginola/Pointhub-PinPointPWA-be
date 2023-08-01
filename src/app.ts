import express, { static as ExpressStatic, Express } from "express";
import Middleware from "@src/middleware/index.js";
import router from "@src/router.js";
import "./config/googleAuth.js";

export async function createApp() {
  const app: Express = express();

  const middleware = new Middleware(app);
  middleware.registerBeforeRoutes();

  // all files inside src/assets folder is accessible to public within /assets path
  app.use("/assets", ExpressStatic("src/assets"));

  // all files inside src/assets folder is accessible to public within /assets path
  app.use("/export", ExpressStatic("src/export"));

  // all of your endpoint should be inside router
  app.use("/", router());

  middleware.registerAfterRoutes();

  return app;
}
