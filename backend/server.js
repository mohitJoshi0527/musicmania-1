import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import adminRoute from "./routes/admin.js";
import songRoutes from './routes/songs.js';
import paymentRoutes from "./routes/paymentRoutes.js"
import cookieParser from "cookie-parser";
import path from "path";
dotenv.config();

connectDB();

const app = express();


const _dirname = path.resolve()
// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from your frontend
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use(cookieParser())

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoute);
app.use('/api/songs', songRoutes);
app.use("/api/payment",paymentRoutes)

app.use(express.static(path.join(_dirname,"/frontend/dist")))
app.get("*",(req,res)=>{
  res.sendFile(path.resolve(_dirname,"frontend","dist","index.html"))
})
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
