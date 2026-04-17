import JWT from "jsonwebtoken";
import { apiError } from "../Utils/apiError.js";
import { apiResponse } from "../Utils/apiResponse.js";
import { asyncHandler } from "../Utils/asyncHandler.js"
import { User } from "../Models/User.model.js";

const verifyJwtToken = asyncHandler(async(req,res,next)=>{
    
    console.log("AUTH HEADER:", req.headers.authorization);
    // console.log("TOKEN:", token);

    try {   

        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if(!token){
            throw new apiError(401,"UnAuthorized Request");
        }

        const decodeData = JWT.verify(token,process.env.ACCESS_TOKEN_SECRET);
        console.log("DECODED:", decodeData);
        
        const user = await User.findById(decodeData?._id).select("-password -refreshToken");

        if(!user){
            throw new apiError(400,"Invalid Token Access");       
        }

        req.user = user;
        next();
        
    } catch (error) {
        console.log("JWT ERROR:", error.message);

        return res.status(401)  
                  .json(new apiResponse(401,"Invalid Or Expired Token"));
    }
    
});

export { verifyJwtToken };