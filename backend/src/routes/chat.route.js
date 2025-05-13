import express from "express"
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getStreamToken } from "../controller/chat.controller.js";

const router= express.Router();

router.get("/token",protectRoute,getStreamToken)
export default router;