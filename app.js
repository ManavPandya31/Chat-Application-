import express from 'express';
import cors from 'cors';
import compression from 'compression';
import authRoute from "./Routers/Auth.route.js";
import messageRoute from "./Routers/Message.route.js";
import userRoute from "./Routers/User.route.js";
import groupRoute from "./Routers/Group.route.js";
import path from "path";

const app = express();
const __dirname = path.resolve();

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

app.use(express.static(path.join(__dirname, "../Frontend/dist")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/dist/index.html"));
});

export default app;