let io;

export const setSocketInstance = (ioInstance) => {
  io = ioInstance;
};

export const emitMessagesSeen = (userId, messageIds) => {
    
  if (!io) return;

  io.to(userId.toString()).emit("messagesSeen", {
    messageIds,
  });
};