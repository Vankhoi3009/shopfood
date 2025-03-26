import { NextRequest, NextResponse } from "next/server";
import { GridFSBucket } from "mongodb";
import mongoose from "mongoose";
import connectDB from "@backend/config/db";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    if (mongoose.connection.readyState !== 1) {
      return NextResponse.json({ error: "Database not connected" }, { status: 500 });
    }
    const client = mongoose.connection.getClient();
    const dbName = mongoose.connection.db?.databaseName || 'test';
    const db = client.db(dbName);
    const bucket = new GridFSBucket(db, { bucketName: "uploads" });
    const form = await req.formData();
    const file = form.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    return new Promise<Response>((resolve, reject) => {
      const uploadStream = bucket.openUploadStream(file.name, {
        metadata: { 
          contentType: file.type,
          originalName: file.name 
        }
      });
      uploadStream.on('error', (error) => {
        console.error('Upload error:', error);
        reject(NextResponse.json({ error: "Upload failed" }, { status: 500 }));
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
}