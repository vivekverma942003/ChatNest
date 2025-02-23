import mongoose from "mongoose";

export const connectDB = async()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Mongo Db connected ${conn.connection.host}`);
        
    }catch(err){
        console.log("MongoDB connection error", err);
    }
}