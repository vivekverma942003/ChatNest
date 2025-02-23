import jwt from "jsonwebtoken";


export const generateToken =(userId,res)=>{

    const token=jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"7d"
    })
    res.cookie("jwt",token,{
        maxAge: 7*24*6*100,
        httpOnly:true, //This prevents the cross site scripting attack
        sameSite:"strict", // this prevents from the csrf attacks cross site request forgery attack
        secure:process.env.NODE_ENV!=="development",
    });
    return token;
}