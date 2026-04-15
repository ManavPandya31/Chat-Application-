import dotenv from "dotenv";
dotenv.config({path : "./.env"});

import app from "./app.js";
import db from "./DB/db.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { chatSocket } from "./Sockets/chat.socket.js";

chatSocket(io);

//Socket Server Setup...
//http Server..
const server = createServer(app);

//Attach Socketttt,
const io = new Server(server,{
    cors : {
        origin : "*",
    },
});

//Socket logic...
io.on("connection", (socket) => {
    console.log("User Connected..",socket.id);

    socket.on("disconnect",()=>{
        console.log("User Disconnected..",socket.id);
    });
    
});

db()
    .then(()=>{
        server.listen(process.env.PORT || 3000,()=>{
        console.log(`Server Running At ${process.env.PORT}`); 
    });
})
    .catch((error)=>{
        console.log("Serever Connection Error",error);
});