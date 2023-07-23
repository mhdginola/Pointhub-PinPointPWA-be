import { Router } from "express";
import * as controller from "./controller/index.js";
import auth from "../../middleware/auth.js";
const router = Router();
router.post("/", auth, controller.createController);
router.patch("/:id", auth, controller.acceptController);
router.delete("/:id", auth, controller.deleteController);
export default router;
