import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, //exclude current user
        { _id: { $nin: currentUser.friends } }, // exclude current user's friends
        { isOnboarded: true },
      ],
    });
    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.error("Error in getRecommendedUsers controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyFriends(req, res) {
  try {
    const currentUser = await User.findById(req.user.id)
      .select("friends")
      .populate(
        "friends",
        "fullName profilePic nativeLanguage learningLanguage"
      );
     
    res.status(200).json(currentUser.friends);
  } catch (error) {
    console.log("error in getMyFriends ", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


export async function sendFriendRequest (req,res) {
    try {
        const myId= req.user.id;
        const {id:recipientId}= req.params;

        //prevent request to ourself
        if(myId==recipientId) {
           return res.status(400).json({message:"you cant send request to yourself"});
        }
      const recipient = await User.findById(recipientId);
      if(!recipient) {
        return res.status(404).json({message:"Recipient Not found"});
      }  

      //if recipient is already a friend
      if(recipient.friends.includes(myId)) {
        return res.status(400).json({message:"The user is already a friend of recipient"});
      }

      //check if a request already exisits
      const existingRequest= await FriendRequest.findOne({
        $or: [
           {sender:myId, recipient:recipientId},
           {sender:recipientId,recipient:myId}
        ]
      });
      if(existingRequest) {
        return res.status(400).json({message:"A friend request already exisits between recipient and user"});
      }

      //create a friend request

      const friendRequest = await FriendRequest.create({
        sender:myId,
        recipient:recipientId
      });
      res.status(201).json(friendRequest);

    } catch (error) {
        console.log("ERror in sending friend request");
        res.status(500).json({message:"INternal server error"});
    }
}