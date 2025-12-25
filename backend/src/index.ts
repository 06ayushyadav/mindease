
import express from "express";
import dotenv from "dotenv"
import connectDB from "./config/db" ;
import cookieParser from "cookie-parser";
import cors from "cors"

import userRouter from "./routes/user.route"
import counselorRouter from "./routes/counselor.route"
import resetRouter from "./routes/reset.route"
import userMoodRouter from "./routes/user.mood.routes"
import adminRouter from "./routes/admin/admin.routes"
import adminRoutes from "./routes/admin/admin-total.route"
import counselorBookingRouter from "./routes/counselor/counselor-booking.routes"
import Appointment from "./routes/counselor/appointment.route"
import SendEmailToCounselor from "./routes/counselor/sendEmail.route"
import counselorPost from "./routes/counselor/resource.route"
import chatbotRouter from "./routes/chatbot/ai-chatbot.routes"

import path from "path";


const app=express()
dotenv.config();

const _dirname=path.resolve();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,
}));

connectDB();
const port= process.env.PORT;

// routers

app.use("/api/user", userRouter)
// http://localhost:5000/api/user/register/
// http://localhost:5000/api/user/login/

// user mood router
app.use("/api/user-mood",userMoodRouter)
// http://localhost:5000/api/user-mood/mood/create-mood
// http://localhost:5000/api/user-mood/mood/:Id
// http://localhost:5000/api/user-mood/mood/:Id - > delete

app.use("/api/counselor",counselorRouter)
// http://localhost:5000/api/counselor/register
// app.use("/api/counselor",CounselorResourceRouter)
// http://localhost:5000/api/counselor/counselor-resource

app.use("/api/counselor-booking",counselorBookingRouter)
// http://localhost:5000/api/counselor-booking/counselor-booking
app.use("/api/appointment", Appointment )
//
app.use("/api/v1/send-email",SendEmailToCounselor)
// counselor resource
app.use("/api/resource",counselorPost)


// ? -> Admin
app.use("/api/admin",adminRouter)
// http://localhost:5000/api/admin/admin-register
app.use("/api/admin", adminRoutes);


 
// reset / forgot pass 
app.use("/api/auth",resetRouter)
// http://localhost:5000/api/auth/forgot-password
// http://localhost:5000/api/auth/reset-password

// chatbot
app.use("/api/ask-ai",chatbotRouter)
// http://localhost:5000/api/ask-ai/chat 



app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.use("/{*splat}", (_, res) => {
  res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});

app.listen(port,()=>{
  console.log(`Server is running on port : http://localhost:${port}`,
  "-> Everyhting is ok")
})
