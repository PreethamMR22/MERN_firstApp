import express from "express"
import "dotenv/config";
import authRoutes from './routes/auth.routes.js'
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser"
import userRoute from "./routes/user.routes.js";
import chatRoute from './routes/chat.route.js';
const app= express()


const PORT= process.env.PORT
app.use(cookieParser()); 
app.use(express.json());
app.use("/api/auth",authRoutes)
app.use("/api/users",userRoute)
app.use("/api/chat",chatRoute)

app.listen(PORT, ( req,res)=> {
    console.log("sever is listening on the port ",PORT);
    connectDB()
})