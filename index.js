import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import app from "./app.js";
import db from "./DB/db.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { setSocketInstance } from "./services/socket.service.js";
import { chatSocket } from "./Sockets/chat.socket.js";

const server = createServer(app);

const io = new Server(server,    {
  cors: {
    origin: "*",
  },
});

setSocketInstance(io);

// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

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