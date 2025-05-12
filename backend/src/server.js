import express from "express"
import "dotenv/config";
import authRoutes from './routes/auth.routes.js'
import { connectDB } from "./lib/db.js";
const app= express()


const PORT= process.env.PORT

app.use(express.json());
app.use("/api/auth",authRoutes)

app.listen(PORT, ( req,res)=> {
    console.log("sever is listening on the port ",PORT);
    connectDB()
})