import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import app from "./app.js";
import db from "./DB/db.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { chatSocket } from "./Sockets/chat.socket.js";

const server = createServer(app);

const io = new Server(server,    {
  cors: {
    origin: "*",
  },
});

chatSocket(io);

db()
  .then(() => {
    server.listen(process.env.PORT || 3000, () => {
      console.log(`Server Running At ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Server Connection Error", error);
  });