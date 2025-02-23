import {Server} from "socket.io";
import http from "http";
import express from "express"

const app= express()
const server= http.createServer(app);


const io= new Server(server,{
    cors:{
        origin:["http://localhost:5173"],
    }
})

const userSocketMap={};

export function getReceiverSocketId(userId){
        return userSocketMap[userId]
}


// used to store the online users

io.on("connection", (socket)=>{
    console.log("A user connected",socket.id);
    const userId=socket.handshake.query.userId;
    if(userId) userSocketMap[userId]=socket.id


    // send the online users to the global level to see everyone
    // io.emit() is used to send the events to all the connected users 
    io.emit("getOnlineUsers",Object.keys(userSocketMap))


    socket.on("disconnect" ,()=>{
        console.log("A user has disconnected",socket.id)
        delete userSocketMap[userId]
        io.emit("getOnlineUsers",Object.keys(userSocketMap))
    })
})

export {io,app,server};
