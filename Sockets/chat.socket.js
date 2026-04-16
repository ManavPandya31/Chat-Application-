import JWT from "jsonwebtoken";
import { User } from "../Models/User.model.js";
import { Message } from "../Models/Message.model.js";

const onlineUsers = new Map();

export const chatSocket = (io) => {

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("Unauthorized: No token"));
      }

      const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);

      const user = await User.findById(decoded._id).select("-password -refreshToken",);

      if (!user) {
        return next(new Error("Unauthorized: Invalid user"));
      }

      socket.user = user;
      next();

    } catch (error) {
      return next(new Error("Unauthorized: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    const userId = socket.user._id.toString();

    socket.join(userId);
    onlineUsers.set(userId, socket.id);
    socket.userId = userId;

    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));

    socket.on("joinChat", ({ userId, receiverId }) => {
      const currentUserId = socket.user._id.toString();
      const roomId = [currentUserId, receiverId.toString()].sort().join("_");
      socket.join(roomId);
      console.log(`Joined Room: ${roomId}`);
    });

    socket.on("sendMessage", async ({ sender, receiver, text }) => {
      try {
        const actualSender = socket.user._id;

        if (!receiver || !text) return;

        const message = await Message.create({
          sender: actualSender,
          receiver,
          text,
        });

        const roomId = [actualSender.toString(), receiver.toString()]
          .sort()
          .join("_");

        io.to(roomId).emit("receiveMessage", message);

      } catch (error) {
        console.log("Message Error:", error);
        socket.emit("errorMessage", "Failed to send message");
      }
    });

    socket.on("typing", ({ sender, receiver }) => {
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

    socket.on("disconnect", () => {
      console.log("User Disconnected:", socket.id);

      if (socket.userId) {
        onlineUsers.delete(socket.userId);
      }

      io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
    });
  });
};
