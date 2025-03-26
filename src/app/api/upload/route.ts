import { NextRequest, NextResponse } from "next/server";
import { GridFSBucket } from "mongodb";
import mongoose from "mongoose";
import connectDB from "@backend/config/db";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const db = mongoose.connection.db;

    if (!db) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }

    const bucket = new GridFSBucket(db, { bucketName: "uploads" });

    const form = await req.formData();
    const file = form.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    return new Promise<Response>((resolve, reject) => {
      const uploadStream = bucket.openUploadStream(file.name, {
        metadata: { contentType: file.type, uploadedAt: new Date() }
      });

      uploadStream.on('error', (error) => {
        reject(NextResponse.json({ error: "Upload failed", details: error.message }, { status: 500 }));
      });

      uploadStream.on('finish', () => {
        resolve(NextResponse.json({ message: "File uploaded successfully", filename: file.name }));
      });

      uploadStream.write(fileBuffer);
      uploadStream.end();
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed", details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
