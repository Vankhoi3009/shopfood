import { NextRequest, NextResponse } from "next/server";
import connectDB from "@backend/config/db";

export const GET = async () => {
  try {
    const db = await connectDB();
    if (!db) return NextResponse.json({ error: "Database connection failed" }, { status: 500 });

    const test = await db.collection("test").find().toArray();
    return NextResponse.json(test);
  } catch (error) {
    console.error("❌ GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const db = await connectDB();
    if (!db) return NextResponse.json({ error: "Database connection failed" }, { status: 500 });

    const { name, image } = await req.json();
    await db.collection("test").insertOne({ name, image });

    return NextResponse.json({ message: "Product added successfully" });
  } catch (error) {
    console.error("❌ POST Error:", error);
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
};
