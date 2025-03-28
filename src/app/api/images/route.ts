import { NextResponse } from "next/server";
import connectDB from "@backend/config/db"; 
import mongoose from "mongoose";

export async function GET() { 
  try { 
    // Detailed connection logging
    console.log('🔄 Attempting to connect to MongoDB...');
    
    await connectDB();
    
    console.log('Connection State:', mongoose.connection.readyState);
    
    if (mongoose.connection.readyState !== 1) { 
      console.error('❌ MongoDB connection not established');
      return NextResponse.json({ 
        error: "MongoDB connection failed", 
        connectionState: mongoose.connection.readyState 
      }, { status: 500 }); 
    } 

    const db = mongoose.connection.db;
    if (!db) {
      console.error('❌ Database not selected');
      return NextResponse.json({ error: "Database not selected" }, { status: 500 });
    }

    // Lấy danh sách file từ GridFS
    const files = await db.collection("uploads.files").find({}).toArray();

    if (!files) {
      console.error('❌ Error retrieving files');
      return NextResponse.json({ error: "Error retrieving files" }, { status: 500 });
    }

    if (files.length === 0) {
      console.warn('⚠️ No images found');
      return NextResponse.json({ error: "No images found" }, { status: 404 });
    }

    // Tạo danh sách ảnh
    const images = files.map(file => ({
      filename: file.filename,
      contentType: file.metadata?.contentType || "image/jpeg",
    }));

    return NextResponse.json(images);
  } catch (error) { 
    console.error('❌ Unexpected error:', error);
    
    // More detailed error response
    return NextResponse.json({
      error: "Failed to fetch images",
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 }); 
  } 
}