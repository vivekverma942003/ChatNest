import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId,io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUserForSidebar = async(req,res)=>{
    try{
        const loggedInUserId= req.user._id;
        const filteredUsers = await User.find({_id:{$ne:loggedInUserId}}).select("-password");
        res.status(200).json({
            filteredUsers
        })
    }
    catch(err){
        console.log("some error occured in the getuserforsidebar" + err);
        res.status(500).json({
            error:"Internal error at the userforsidebar"
        })
    }
}


export const getMessages =async(req,res)=>{
    try{
        const {id:userToChatId}= req.params;
        const myId=req.user._id;
        const messages = await Message.find({
            // all the message send by me or the sender has send it to me 
            $or:[
                {senderId:myId, receiverId:userToChatId},
                {senderId:userToChatId,receiverId:myId}
            ],
        })
        res.status(200).json(messages);
    }
    catch(err){
        console.log("error in the  getMessage"+ err);
        res.status(500).json({
            error:"error has occured in the getmessage function"
        })
    }
}


// export const sendMessage =async(req,res)=>{
//     try{
//         const {text,image}=req.body;
//         const {id:receiverId}=req.params;
//         const senderId=req.user._id;
//         let imageUrl;
//         if(image){
//             // upload the image to the cloudinary
//             const uploadResponse= await cloudinary.uploader.upload(image);
//             imageUrl=uploadResponse.secure_url;
//         }
//         const newMessage= new Message({
//             senderId,
//             receiverId,
//             text,
//             image:imageUrl
//         })
//         await newMessage.save();

//         // We will add here the real time using socket io
//         const receiverSocketId=getReceiverSocketId(receiverId);
//         if(receiverSocketId){
//             io.to(receiverId).emit("newMessage",newMessage)
//         }
//         res.status(201).json(newMessage);

//     }
//     catch(err){
//         console.log("error has occured in the sendmessage" + err.message);
//         res.status(500).json({
//             error:"Error in the sendMessage part"
//         })
//     }
// }


export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        let imageUrl;

        // Upload image to Cloudinary if it exists
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        // Save the message to the database
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });
        await newMessage.save();

        // Send real-time message using Socket.IO
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage); // Emit to the correct socket ID
        }

        // Respond with the new message
        res.status(201).json(newMessage);
    } catch (err) {
        console.error("Error in sendMessage:", err); // Log full error details
        res.status(500).json({
            error: "Error in the sendMessage part",
        });
    }
};
