import mongoose from "mongoose"


export const connectDB= async ()=> {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo Connection successfull");
    } catch (error) {
        console.log("Mongo DB connection failed: ",error);
        process.exit(1);
    }
}