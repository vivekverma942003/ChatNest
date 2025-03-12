import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import path from "path";
import { app ,server} from "./lib/socket.js";

dotenv.config();
const PORT=process.env.PORT || 5000
const __dirname=path.resolve();


// const app=express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));

app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../Frontend/dist")))
    app.get("*", (req,res)=>{
        res.sendFile(path.join(__dirname, "../Frontend","dist","index.html"))
    })
}

server.listen(PORT,()=>{
    console.log("Server is running on the port:"+ PORT);
    connectDB();
})
