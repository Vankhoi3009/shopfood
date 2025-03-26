import { NextRequest, NextResponse } from "next/server";
import { GridFSBucket } from "mongodb";
import mongoose from "mongoose";
import connectDB from "@backend/config/db";

export const POST = async (req: NextRequest) => {
  try {
    // Kết nối database
    await connectDB();

    // Kiểm tra kết nối MongoDB
    if (mongoose.connection.readyState !== 1) {
      return NextResponse.json({ error: "Database not connected" }, { status: 500 });
    }

    // Lấy client MongoDB
    const client = mongoose.connection.getClient();
    const dbName = mongoose.connection.db?.databaseName || 'test';
    const db = client.db(dbName);

    const bucket = new GridFSBucket(db, { bucketName: "uploads" });

    const form = await req.formData();
    const file = form.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    // Chuyển file thành buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Tạo upload stream
    const uploadStream = bucket.openUploadStream(file.name, {
      metadata: { 
        contentType: file.type,
        originalName: file.name 
      }
    });

    // Trả về Promise
    return new Promise((resolve) => {
      uploadStream.on('error', (error) => {
        console.error('Upload error:', error);
        resolve(NextResponse.json({ error: "Upload failed" }, { status: 500 }));
      });

      uploadStream.on('finish', () => {
        resolve(NextResponse.json({ 
          message: "File uploaded successfully",
          filename: file.name 
        }));
      });

      uploadStream.write(fileBuffer);
      uploadStream.end();
    });

  } catch (error) {
    console.error('Upload catch error:', error);
    return NextResponse.json({ 
      error: "Upload failed", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
};