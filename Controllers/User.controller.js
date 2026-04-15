import { asyncHandler } from "../Utils/asyncHandler.js";
import { apiError } from "../Utils/apiError.js";
import { apiResponse } from "../Utils/apiResponse.js";
import { User } from "../Models/User.model.js";

             const options = {
                httpOnly : true,
                secure : true,
             };

const accessAndRefreshTokens = async(userId)=>{

   try {
     const user = await User.findById(userId);
     const accessToken = await user.generateAccessToken();
     const refreshToken = await user.generateRefreshToken();

      user.refreshToken = refreshToken;
         await user.save({ validateBeforeSave : false });

         return { accessToken , refreshToken }

   } catch (error) {
        throw new apiError(501,"Something Problem While Genarate Tokens");
   }

};

const registeruser = asyncHandler(async(req,res) => {

    const { Name , Mobile , Gender , Email , password } = req.body;

    if(!Name ||  !Mobile || !Gender || !Email || !password) {
        throw new apiError(400,"Required Field Is Missing...");
    }

    const userExisted = await User.findOne({Email})

    if(userExisted){
        throw new apiError(400,"User Is Already Existed With This Email...");
    }

    const user = await User.create({
        Name,
        Mobile,
        Gender,
        Email,
        password
    });
  
    return res.status(200)
              .json(new apiResponse(200 , user , "User Register Sucessfully..."));

});

const loginUser = asyncHandler(async(req,res) => {

    const { Email , password } = req.body;

        if(!Email || !password){
            throw new apiError(400,"Register Required First..");
        }

     const user = await User.findOne({Email});

     if(!user){
        throw new apiError(400,"User Is Not Found..");
     }

     const isPasswordValid = await user.isPasswordCorrect(password);
            if(!isPasswordValid){
                throw new apiError(400,"Password Is Incorrect..");
            }

     const { accessToken , refreshToken } = await accessAndRefreshTokens(user._id);
             
     const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        return res.status(200)
                   .cookie("accessToken",accessToken,options)
                   .cookie("refreshToken",refreshToken,options)
                   .json(new apiResponse(200,  
                        { user: loggedInUser,accessToken,refreshToken },
                            "User Logged In Successfully"   
        )
    );


});

const getAllUsers = asyncHandler(async(req,res) => {

    const users = await User.find().select("-password -refreshToken");

    return res.status(200)
              .json(new apiResponse(200,users,"All Users fetch Sucessfully"));
})

export { registeruser , loginUser , getAllUsers }