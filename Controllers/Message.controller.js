import { asyncHandler } from "../Utils/asyncHandler.js";
import { Message } from "../Models/Message.model.js";
import { apiResponse } from "../Utils/apiResponse.js";
import { emitMessagesSeen } from "../services/socket.service.js";
import mongoose from "mongoose";

const getMessages = asyncHandler(async (req, res) => {
  const { senderId, receiverId } = req.params;

  const messages = await Message.find({
    $or: [
      { sender: senderId, receiver: receiverId },
      { sender: receiverId, receiver: senderId },
    ],
  })
    .sort({ createdAt: 1 })
    .populate("sender", "Name Email");

  return res.status(200).json(new apiResponse(200, messages));
});

const getUnreadCounts = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const counts = await Message.aggregate([
    {
      $match: {
        receiver: new mongoose.Types.ObjectId(userId),
        seen: false,
      },
    },
    {
      $group: {
        _id: "$sender",
        count: { $sum: 1 },
      },
    },
  ]);

  const formatted = {};

  counts.forEach((item) => {
    formatted[item._id] = item.count;
  });

  return res.status(200).json(new apiResponse(200, formatted));
});

const markMessagesAsSeen = asyncHandler(async (req, res) => {
  
  const { senderId, receiverId } = req.body;

  const messages = await Message.find({
    sender: senderId,
    receiver: receiverId,
    seen: false,
  });

  const messageIds = messages.map((msg) => msg._id);

  await Message.updateMany(
    {
      sender: senderId,
      receiver: receiverId,
      seen: false,
    },
    {
      $set: { seen: true },
    },
  );

  emitMessagesSeen(senderId, messageIds);

  return res
    .status(200)
    .json(new apiResponse(200, {}, "Messages marked as seen"));
});

export { getMessages, getUnreadCounts, markMessagesAsSeen };
