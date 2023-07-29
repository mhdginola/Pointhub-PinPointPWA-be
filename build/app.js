import express, { static as ExpressStatic } from "express";
import Middleware from "./middleware/index.js";
import router from "./router.js";
import "./config/googleAuth.js";
export async function createApp() {
    const app = express();
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
