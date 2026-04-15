import { asyncHandler } from "../Utils/asyncHandler.js";
import { Message } from "../Models/Message.model.js";
import { apiResponse } from "../Utils/apiResponse.js";

const getMessages = asyncHandler(async(req,res) => {

    const { senderId, receiverId } = req.params;

    const messages = await Message.find({
        $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
        ],
    })
        .sort({ createdAt: 1 })
        .populate("sender", "Name Email");

    return res.status(200)
              .json(new apiResponse(200,messages))
});

export { getMessages }