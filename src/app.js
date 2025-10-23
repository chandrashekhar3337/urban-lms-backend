import express from 'express'
import cors from 'cors'
import cookieParser from "cookie-parser"
import "./utils/cronJobs.js";

 const app = express();

 app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET","POST","PUT","DELETE"],
    credential:true
 }))

 app.use(express.json({limit:"16kb"}))
 app.use(express.urlencoded({extended:true, limit:"16kb"}))
 app.use(express.static("public"))

 app.use(cookieParser())

// src/index.js  (or src/server.js — jahan bhi listen kar raha ho)
app.get("/", (req, res) => {
  res.send("Lead Management API is running...");
});

 // routes:import
 import router from './routes/leadRoutes.js'
 // routed declartion:
app.use("/api/v1/users",router);
// app.use('/api/v1/users', renderRoutes);

 export { app }