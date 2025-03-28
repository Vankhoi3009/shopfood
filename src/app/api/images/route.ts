import { NextResponse } from "next/server";
import connectDB from "@backend/config/db"; 
import mongoose from "mongoose";

export async function GET() { 
  try { 
    await connectDB();
    
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json({ error: "Database not selected" }, { status: 500 });
    }

    const files = await db.collection("uploads.files").find({}).toArray();

    if (!files?.length) {
      return NextResponse.json({ error: "No images found" }, { status: 404 });
    }

    const images = files.map(file => ({
      filename: file.filename,
      contentType: file.metadata?.contentType || "image/jpeg",
    }));

    return NextResponse.json(images);
  } catch (error) { 
    console.error('❌ Unexpected error:', error);
    
    return NextResponse.json({
      error: "Failed to fetch images",
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 }); 
  } 
}