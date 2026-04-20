import JWT from "jsonwebtoken";
import { User } from "../Models/User.model.js";
import { Message } from "../Models/Message.model.js";

//-> emit = Send Data
//-> io = Recieve Data

const onlineUsers = new Map();

export const chatSocket = (io) => {

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("Unauthorized: No token"));
      }

      const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);

      const user = await User.findById(decoded._id).select(
        "-password -refreshToken",
      );

      if (!user) {
        return next(new Error("Unauthorized: Invalid user"));
      }

      socket.user = user;
      next();
    } catch (error) {
      return next(new Error("Unauthorized: Invalid token"));
    }
  });

  //Connection Establishing...
  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    const userId = socket.user._id.toString();
    //join persnol room...Each user gets their own private room/Chat
    socket.join(userId);

    onlineUsers.set(userId, socket.id);
    socket.userId = userId;

    //Send Online Users List To All Users...
    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));

    //Join In The Persnol Char Room...
    socket.on("joinChat", ({ receiverId }) => {
      const currentUserId = socket.user._id.toString();
      const roomId = [currentUserId, receiverId.toString()].sort().join("_");
      socket.join(roomId); //roomId = private chat
      console.log(`Joined Room: ${roomId}`);
    });

    //From Here Start Conversition...
    socket.on("sendMessage", async ({ receiver, text }) => {
      try {
        const sender = socket.user._id;
        if (!receiver || !text) return;

        const message = await Message.create({
          sender,
          receiver,
          text,
        });

        const roomId = [sender.toString(), receiver.toString()].sort().join("_");

        io.to(roomId).emit("receiveMessage", {
          ...message._doc,
          sender: sender.toString(), // Explicitly send as string
        });

      } catch (error) {
        console.log("Message Error:", error);
      }
    });

    socket.on("typing", ({ receiver }) => {
      const actualSender = socket.user._id;
      const roomId = [actualSender.toString(), receiver.toString()].sort().join("_");
      socket.to(roomId).emit("typing", { sender: actualSender });
    });

    socket.on("markSeen", async ({ messageId, senderId }) => {
      try {
        await Message.findByIdAndUpdate(messageId, { seen: true });

        io.to(senderId.toString()).emit("messageSeen", { messageId });
      } catch (error) {
        console.log("Seen Error:", error);
      }
    });

    //Start Here For Group Chating...
    //For Group Chatting Need The GroupId

    socket.on("joinGroup", ({ groupId }) => {
        socket.join(groupId);
        console.log("Joined Group:", groupId);
      });

      socket.on("sendGroupMessage", async ({ groupId, text }) => {
        try {
          const sender = socket.user._id;

          if (!groupId || !text) return;

          const message = await Message.create({
            sender,
            groupId,
            text,
          });

          io.to(groupId).emit("receiveGroupMessage", {
            ...message._doc,
            sender: sender.toString(),
          });

        } catch (error) {
          console.log("Group Message Error:", error);
        }
      });

      socket.on("typingGroup", ({ groupId }) => {
        const sender = socket.user._id;

        socket.to(groupId).emit("typingGroup", {
          sender,
        });
      });

      socket.on("markGroupSeen", async ({ messageId }) => {
        await Message.findByIdAndUpdate(messageId, { seen: true });
      });

    //Connection Closing...
    socket.on("disconnect", () => {
      console.log("User Disconnected:", socket.id);

      if (socket.userId) {
        onlineUsers.delete(socket.userId);
      }

      io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
    });
  });
};
