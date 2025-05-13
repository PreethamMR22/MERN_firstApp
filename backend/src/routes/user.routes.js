import express from "express"
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getMyFriends, getRecommendedUsers, sendFriendRequest } from "../controller/user.controller.js";
const router = express.Router();

//apply the middleware all of the routes i defined here
router.use(protectRoute);

router.get("/",protectRoute,getRecommendedUsers);
router.get("/friends",getMyFriends);
router.get("/friend-request/:id",protectRoute,sendFriendRequest)
export default router;