import mongoose from "mongoose";
import bcrypt from "bcryptjs"
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
        type:String,
        required:true,
        unique:true,
    },
    password: {
        type:String,
        required:true,
        minlength: [6,"Minimum of 6 characters is required"]
    },
    profilePic: {
        type:String,
        default: "",
    },
    nativeLanguage: {
        type:String,
        default:""
    },
    learningLanguage: {
        type:String,
        default:""
    },   
    location: {
        type:String,
        default:""
    },
    isOnBoarded: {    //once the user has registerd to the website , only then they are allowed to visit other fields
        type:Boolean,
        default:false
    },
    friends: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }]

  },
  { timestamps: true }
);


 //pre hook : before saving the password, we need to hash the password 
userSchema.pre("save",async function(next) {
    if(!this.isModified("password")) return next();
    try {
        const salt =await bcrypt.genSalt(10);
        this.password= await bcrypt.hash(this.password,salt);
        next();
    } catch (error) {
        next(error);
    }
})

userSchema.methods.matchPassword=async function (password) {
      return await bcrypt.compare(password,this.password);
}

 const User= mongoose.model("User",userSchema)
 export default User;