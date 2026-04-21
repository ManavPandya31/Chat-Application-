import express from 'express';
import cors from 'cors';
import compression from 'compression';
import authRoute from "./Routers/Auth.route.js";
import messageRoute from "./Routers/Message.route.js";
import userRoute from "./Routers/User.route.js";
import groupRoute from "./Routers/Group.route.js";

const app = express();

// app.use(cors({
//   origin: "https://chat-application-by-manavpandya.onrender.com",
//   credentials: true
// }));
const allowedOrigins = [
  "http://localhost:5173",
  "https://chat-application-by-manavpandya.onrender.com"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(compression());
app.use(express.json());    
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth",authRoute);
app.use("/api/messages",messageRoute);
app.use("/api/user",userRoute);
app.use("/api/groups",groupRoute);


export default app;