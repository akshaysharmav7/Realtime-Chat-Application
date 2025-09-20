import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import { connectDb } from "./config/db.mongo.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT;

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Express 5 catch all routes   
app.use((req, res)=>{
    res.send("We couldn't find the route")
})

app.listen(PORT, ()=>{
    console.log(`Server is running at localhost:${PORT}`);
    connectDb();
})