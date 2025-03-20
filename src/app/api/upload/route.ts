import { NextRequest, NextResponse } from "next/server";
import { GridFSBucket, Db } from "mongodb";
import mongoose from "mongoose";

export const POST = async (req: NextRequest) => {
  try {
    // Kiểm tra kết nối MongoDB
    if (mongoose.connection.readyState !== 1) {
      return NextResponse.json({ error: "Database not connected" }, { status: 500 });
    }

    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json({ error: "Failed to get database instance" }, { status: 500 });
    }

    const bucket = new GridFSBucket(db as Db, { bucketName: "uploads" });

    const form = await req.formData();
    const file = form.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const uploadStream = bucket.openUploadStream(file.name);
    const buffer = await file.arrayBuffer();
    uploadStream.end(Buffer.from(buffer));

    return NextResponse.json({ message: "File uploaded successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
};