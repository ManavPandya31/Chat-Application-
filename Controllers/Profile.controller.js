import { asyncHandler } from "../Utils/asyncHandler.js"
import { apiError } from "../Utils/apiError.js";
import { apiResponse } from "../Utils/apiResponse.js";
import { User } from "../Models/User.model.js";
import { uploadOnCloudinary } from "../Utils/cloudinary.js";

const getMyProfile = asyncHandler(async(req,res) => {

     const user = await User.findById(req.user._id)
        .select("-password -refreshToken");

    return res.status(200)
              .json(new apiResponse(200,user,"User Profile fetch Sucessfully..."));
});

const updateMyProfile = asyncHandler(async(req,res) => {

    const { Name, Mobile, bio } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new apiError(404, "User not found");
    }

    user.Name = Name || user.Name;
    user.Mobile = Mobile || user.Mobile;
    user.bio = bio || user.bio;

    if (req.file) {

        const uploadImage = await uploadOnCloudinary(req.file.buffer);

        if (!uploadImage) {
            throw new apiError(400, "Image Upload Failed");
        }

        user.profilePicture = uploadImage.secure_url;
    }

    await user.save();

    return res.status(200)
              .json(new apiResponse(200,user,"Profile Updated Sucessfully..."))
})

export { getMyProfile , updateMyProfile}