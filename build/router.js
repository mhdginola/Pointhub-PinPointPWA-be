import express from "express";
import exampleRouter from "./modules/example/router.js";
import authRouter from "./modules/googleApi/router.js";
import groupRouter from "./modules/group/router.js";
import tagLocationRouter from "./modules/tagLocation/router.js";
import invitationRouter from "./modules/invitation/router.js";
import attendanceRouter from "./modules/attendance/router.js";
export default function () {
    const app = express();
    /**
     * Register all available modules
     * <modules>/router.ts
     */
    app.use("/v1/examples", exampleRouter);
    app.use("/v1/auth", authRouter);
    app.use("/v1/groups", groupRouter);
    app.use("/v1/tagLocations", tagLocationRouter);
    app.use("/v1/invitations", invitationRouter);
    app.use("/v1/attendances", attendanceRouter);
    return app;
}
