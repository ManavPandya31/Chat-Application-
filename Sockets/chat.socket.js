import { Message } from "../Models/Message.model.js";

const onlineUsers = new Map();

export const chatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    socket.on("userOnline", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log("Online Users:", onlineUsers);
    });

    socket.on("joinChat", ({ userId, receiverId }) => {
      const roomId = [userId, receiverId].sort().join("_");
      socket.join(roomId);
      console.log(`Joined Room: ${roomId}`);
    });
    
    socket.on("sendMessage", async ({ sender, receiver, text }) => {
      try {
        const roomId = [sender, receiver].sort().join("_");

        const message = await Message.create({
          sender,
          receiver,
          text,
        });

        io.to(roomId).emit("receiveMessage", message);
      } catch (error) {
        console.log("Message Error:", error);
      }
    });

    socket.on("markSeen", async ({ messageId }) => {
      try {
        await Message.findByIdAndUpdate(messageId, { seen: true });

        io.emit("messageSeen", { messageId });
      } catch (error) {
        console.log("Seen Error:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected:", socket.id);

      for (let [key, value] of onlineUsers.entries()) {
        if (value === socket.id) {
          onlineUsers.delete(key);
        }
      }

      console.log("Online Users After Disconnect:", onlineUsers);
    });
  });
};