import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import * as authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import adminRoutes from "./routes/admin.js";
import imageRoutes from "./routes/Image.js";


const app = express();
app.use("/api/images", imageRoutes);
// Middleware
app.use(cors());
app.use(express.json());

// Kết nối DB
connectDB();
console.log("ket noi:", connectDB);

// Routes
app.use("/api/auth/login", userRoutes);
app.use("/api/auth/register", authRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
