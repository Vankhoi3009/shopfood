import { NextResponse } from "next/server";
import connectDB from "@backend/config/db";
import mongoose from "mongoose";

export const GET = async () => {
  try {
    await connectDB();

    if (mongoose.connection.readyState !== 1) {
      return NextResponse.json({ error: "MongoDB connection failed" }, { status: 500 });
    }

    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json({ error: "Database not found" }, { status: 500 });
    }

    const files = await db.collection("uploads.files").find().toArray();

    return NextResponse.json(files);
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }
};