import express from 'express';
import cors from 'cors';
import compression from 'compression';
import authRoute from "./Routers/Auth.route.js";
import messageRoute from "./Routers/Message.route.js";
import userRoute from "./Routers/User.route.js";

const app = express();

app.use(cors());
app.use(compression());
app.use(express.json());    
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth",authRoute);
app.use("/api/messages",messageRoute);
app.use("/api/user",userRoute);

export default app;