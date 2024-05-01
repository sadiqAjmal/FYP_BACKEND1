import express from "express";
import auth from "./auth";
import { authenticateToken } from "../middlewares/authenticateToken";
import notifications from "./firebaseNotifications";
const router = express.Router();
router.use("/auth", auth);
router.use("/notifications", notifications);
export default router;
