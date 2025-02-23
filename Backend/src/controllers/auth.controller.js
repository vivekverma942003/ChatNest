import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt, { genSalt } from "bcryptjs";


export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        // Now hash the upcoming password using the bcrypt js 

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })

        if (newUser) {
            // we have to generate the jwt tokens
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: fullName,
                email: email,
                profilePic: newUser.profilePic,
            });

        }
        else {
            res.status(400).json({
                message: "Invalid user data"
            })
        }

    }
    catch (err) {
        console.log("error in the signup controller", err.message);
        res.status(500).json({
            message: "Some thing has been broken into the intern sever"
        })
    }
}


export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials or user does not exists"
            })
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Invalid password"
            })
        }
        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        })

    }
    catch (err) {
        console.log("Somethiing error in login part " + err.message);
        res.status(500).json({
            message: "login part has an error please check it"
        })
    }
}






export const logout =async (req, res) => {


    try{
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({
            message:"Logged out successfully",
        })
    }
    catch(err){
        console.log("Error in the logout part :" +err);
    }
}

// For uploading an image we need a service for it which is provided by the cloudinary for free
export const updateProfile =async(req,res)=>{

    try{
        const {profilePic}= req.body;
        const userId=req.user._id;
        if(!profilePic){
            return res.status(400).json({
                message:"ProfilePic is required here"
            });
        }
        const uploadResponse=await cloudinary.uploader.upload(profilePic).catch(err=>{
            console.log("error in upload response"+err.message)
        });
        const updatedUser= await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true}).catch(err=>{
            console.log("error in the  updated user"+err);
        });
        res.status(200).json(updatedUser);
    }
    catch(err){
        console.log("error while uploading the profile pic" + err);
        res.status(500).json({
            message:"Internal error while updateing the profile pic"
        })
    }

}



// export const updateProfile = async (req, res) => {
//     try {
//         const { profilePic } = req.body;
//         const userId = req.user._id;

//         // Check if profilePic is provided
//         if (!profilePic) {
//             return res.status(400).json({
//                 message: "ProfilePic is required.",
//             });
//         }

//         let uploadResponse;
//         try {
//             // Attempt to upload the profile picture to Cloudinary
//             uploadResponse = await cloudinary.uploader.upload(profilePic);
//         } catch (err) {
//             console.error("Error in upload response:", err);
//             return res.status(500).json({
//                 message: "Failed to upload profile picture to Cloudinary.",
//             });
//         }

//         // Validate if uploadResponse contains secure_url
//         if (!uploadResponse || !uploadResponse.secure_url) {
//             return res.status(500).json({
//                 message: "Failed to retrieve secure_url from Cloudinary response.",
//             });
//         }

//         let updatedUser;
//         try {
//             // Update the user's profile with the uploaded image URL
//             updatedUser = await User.findByIdAndUpdate(
//                 userId,
//                 { profilePic: uploadResponse.secure_url },
//                 { new: true }
//             );
//         } catch (err) {
//             console.error("Error updating user:", err);
//             return res.status(500).json({
//                 message: "Failed to update user profile with the uploaded image.",
//             });
//         }

//         // Return the updated user details
//         res.status(200).json(updatedUser);
//     } catch (err) {
//         console.error("Error while uploading the profile pic:", err);
//         res.status(500).json({
//             message: "Internal error while updating the profile pic.",
//         });
//     }
// };



export const checkAuth=async(req,res)=>{
    try{
        res.status(200).json(req.user);
    }
    catch(err){
        console.log("some error occured in the check box"+ err);
        res.status(500).json({message:"Internal error occured in the server"});
    }
}
// mxZ9bbAoEeJhNz2V