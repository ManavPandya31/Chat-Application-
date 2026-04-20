import { asyncHandler } from "../Utils/asyncHandler.js";
import { apiResponse } from "../Utils/apiResponse.js";
import { apiError } from "../Utils/apiError.js";
import { Group } from "../Models/Group.model.js";
import { Message } from "../Models/Message.model.js";

const createGroup = asyncHandler(async(req,res) => {

    const { name ,  members } = req.body;

    const group = await Group.create({
        name,
        members,
        admin: req.user._id,
    });

    return res.status(200)
              .json(new apiResponse(200,group,"Group Created Sucesssfullyy..."));
});

const getGroups = asyncHandler(async(req,res) => {

    const groups = await Group.find({
        members: { $in: [req.user._id] },
    }).populate("members", "Name Email");

    return res.status(200)
              .json(new apiResponse(200,groups,"Groups Fetch Sucessfullly..."));
});

const getGroupMessages = asyncHandler(async(req,res) => {

     const { groupId } = req.params;

    const messages = await Message.find({ groupId })
        .sort({ createdAt: 1 })
        .populate("sender", "Name Email");

    return res.status(200)
              .json(new apiResponse(200,messages,"Group Messages Fetch Sucessfully..."))
});

export { createGroup , getGroups , getGroupMessages}
