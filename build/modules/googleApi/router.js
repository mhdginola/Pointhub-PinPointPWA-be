import { Router } from "express";
import { loginWithGoogle, loginWithGoogleCallback, loginWithGoogleSuccess } from "./googleApi.js";
const router = Router();
router.get("/google", loginWithGoogle);
router.get("/google/callback", loginWithGoogleCallback);
router.get("/success", loginWithGoogleSuccess);
export default router;
