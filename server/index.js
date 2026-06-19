
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { connectDb } from "./database/db.js";
import userRoutes from "./routes/user.js";
import courseRoutes from "./routes/courses.js";
import adminRoutes from "./routes/admin.js";
import cors from 'cors';
import Razorpay from "razorpay";

const app = express();
const port = process.env.PORT;

console.log("KEY:", process.env.RAZORPAY_KEY);
console.log("SECRET:", process.env.RAZORPAY_SECRET ? "Loaded" : "Missing");

export const instance = new Razorpay({
    key_id:process.env.RAZORPAY_KEY,
    key_secret:process.env.RAZORPAY_SECRET
})
app.use(express.json());
app.use(cors());

app.use("/uploads",express.static("uploads"))
//using routes

app.use('/api',userRoutes);
app.use('/api',courseRoutes);
app.use('/api',adminRoutes);

app.get("/",(req,res)=>{
    res.send('server working')
});

app.listen(port,()=>{
    console.log(`server was running on port ${port}`);
    connectDb();
});