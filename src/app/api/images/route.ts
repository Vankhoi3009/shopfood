import { NextResponse } from "next/server";
import connectDB from "@backend/config/db";
import mongoose from "mongoose";

export const GET = async () => {
  try {
    // Establish database connection
    await connectDB();

    // Check if MongoDB connection is successful
    if (mongoose.connection.readyState !== 1) {
      return NextResponse.json({ error: "MongoDB connection failed" }, { status: 500 });
    }

    // Get the database connection
    const db = mongoose.connection.db;

    // Verify database connection exists
    if (!db) {
      return NextResponse.json({ error: "Database not found" }, { status: 500 });
    }

    // Fetch all files from the uploads.files collection
    const files = await db.collection("uploads.files").find().toArray();

    // Return the files as JSON response
    return NextResponse.json(files);
  } catch (error) {
    // Handle any errors during the process
    console.error("Error fetching images:", error);
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }
};