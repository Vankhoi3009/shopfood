import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import connectDB from "@backend/config/db"; 
import User from "@backend/models/User.js";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email đã tồn tại!" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    return NextResponse.json({ message: "Đăng ký thành công!" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Lỗi server!" }, { status: 500 });
  }
}
