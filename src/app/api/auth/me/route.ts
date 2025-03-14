import { NextRequest, NextResponse } from "next/server";
import connectDB from "@backend/config/db";
import User from "@backend/models/User.js";
import jwt from "jsonwebtoken";

// ✅ Đảm bảo kết nối với MongoDB
connectDB();

// ✅ Xử lý phương thức GET
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ✅ Đảm bảo biến môi trường JWT_SECRET tồn tại
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json({ message: "Server error: JWT_SECRET is not set" }, { status: 500 });
    }

    // ✅ Xác thực token
    const decoded = jwt.verify(token, jwtSecret) as { id: string };

    // ✅ Lấy user từ MongoDB
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
