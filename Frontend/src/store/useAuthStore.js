import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
// import { disconnect } from "mongoose";

const BASE_URL=import.meta.env.MODE ==="development"?"http://localhost:5001":"/";
export const useAuthStore = create((set,get)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isCheckingAuth:true,
    isUpdatingProfile:false,
    onlineUsers:[],
    socket:null,

    checkAuth:async()=>{
        try{
            const res= await axiosInstance.get("/auth/check");
            set({authUser:res.data});
            get().connectSocket()
        }
        catch(err){
            console.log("Error in checkAuth:",err);
            set({authUser:null})
        }
        finally{
            set({isCheckingAuth:false})
        }
    },
    signUp:async(data)=>{
        set({isSigningUp:true})
        try{
            const res= await axiosInstance.post("/auth/signup",data);
            set({authUser:res.data});
            toast.success("Account created successfully");
            get().connectSocket();
        }
        catch(err){
            toast.error(err.response.data.message);

        }
        finally{
            set({isSigningUp:false})
        }
    },

    logout:async()=>{
        try{
            await axiosInstance.post("/auth/logout");
            set({authUser:null})
            toast.success("Logged out successfully");
            get().disconnectSocket()
        }
        catch(error){
            toast.error("Something went wrong");
            console.log(error.response.data.message)
        }
    },

    login:async(data)=>{
        set({isLoggingIn:true});
        try{
            const res= await axiosInstance.post("/auth/login",data);
            set({authUser:res.data});

            toast.success("Logged in successfully")
            get().connectSocket();
        }
        catch(err){
            toast.error(err.response.data.message);
        }
        finally{
            set({isLoggingIn:false});
        }
    },

    updateProfile:async(data)=>{
        set({isUpdatingProfile:true})
        try{
            const res= await axiosInstance.put("auth/update-profilepic",data);
            set({authUser:res.data});
            toast.success("Profile updated successfully");
            
        }
        catch(err){
            console.log("Error while updating the profile"+ err);
            toast.error(err.response.data.message);
        }
        finally{    
            set({isUpdatingProfile:false});

        }
    },

    connectSocket:()=>{
        const {authUser}=get();
        if(!authUser || get().socket?.connected) return;

        const socket=io(BASE_URL,{
            query:{
                userId:authUser._id,
            }
        })
        socket.connect();
        socket.on("connect", () => {
            console.log("Socket connected:", socket.id);
        });
        set({socket:socket})
        socket.on("getOnlineUsers",(userIds)=>{
            set({onlineUsers:userIds})
        })
    },

    disconnectSocket:()=>{
        if(get().socket?.connected) get().socket.disconnect();
    }
}))