import express from "express"
import { protectRoute } from "../middlewares/auth.middleware.js";
import { acceptFriendRequest, getMyFriends, getOutgoingFriendReqs, getRecommendedUsers, sendFriendRequest } from "../controller/user.controller.js";
import { getFriendRequests } from "../controller/auth.controller.js";
const router = express.Router();

//apply the middleware all of the routes i defined here
router.use(protectRoute);

router.get("/",protectRoute,getRecommendedUsers);
router.get("/friends",getMyFriends);
router.get("/friend-request/:id",protectRoute,sendFriendRequest)
router.put("/friend-request/:id/accept",protectRoute,acceptFriendRequest)
router.get("/friend-requests",protectRoute,getFriendRequests)
router.get("/outgoing-friend-requests",protectRoute,getOutgoingFriendReqs)

export default router;