import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from 'jsonwebtoken'
export async function signup(req, res) {
  const { email, password, fullName } = req.body;
  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "Evert field is necessary" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be of atleast length 6 characters" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser= await User.findOne({email});
    if(existingUser) {
        return res.status(400).json({message:"User with the given email id already exists"});
    }

    const index= Math.floor(Math.random()*100) +1;
    const randomAvatar=  `https://avatar.iran.liara.run/public/${index}.png`

    const newUser = await User.create({
        email,
        fullName,
        password,
        profilePic: randomAvatar
    })

    //creating user in stream as well
   try {
     await upsertStreamUser({
        id:newUser._id.toString(),
        name:newUser.fullName,
        image: newUser.profilePic || ""
    });
    console.log(`Stream user created: ${newUser.fullName}`)
   } catch (error) {
    console.log("error creating stream user : ",error);
   }

    const token = jwt.sign({userId:newUser._id},process.env.JWT_SECRETE_KEY, {
        expiresIn:"7d"
    })

    res.cookie("jwt",token, {
        maxAge:7*24*60*60*1000,
        httpOnly:true,
        sameSite:"strict",
        secure:process.env.NODE_ENV==="production"
    })
    res.status(201).json({success:true,user:newUser})

  } catch (error) {
    console.log("error in signup controller ",error);
    res.status(500).json({message:"Something went wrong while signing up"})
  }
}
export async function login(req, res) {
 try {
     const {email,password}= req.body;
    if(!email || !password) 
        return res.status(400).json({message:"Both email and password fields are required"});
    const existingUser= await User.findOne({email});
    if(!existingUser) return res.status(401).json({message:"Invalid user credentials"})
    
    const isPasswordCorrect= await existingUser.matchPassword(password);
    if(!isPasswordCorrect) return res.status(401).json({message:"Invalid email or password"});

     const token = jwt.sign({userId:existingUser._id},process.env.JWT_SECRETE_KEY, {
        expiresIn:"7d"
    })

    res.cookie("jwt",token, {
        maxAge:7*24*60*60*1000,
        httpOnly:true,
        sameSite:"strict",
        secure:process.env.NODE_ENV==="production"
    })
    res.status(201).json({success:true,user:existingUser})


    } catch (error) {
    console.log("Error in login controller ",error);
    res.status(500).json({message:"Internal server error"});
 }
 
}
export async function logout(req, res) {
  res.clearCookie("jwt");
  res.status(200).json({success:true,message:"Logged out successfully"})
}
