import { NextResponse } from "next/server";
import connectDB from "@backend/config/db";
import mongoose from "mongoose";

export const POST = async (req: Request): Promise<NextResponse> => {
  try {
    await connectDB();

    // Explicitly get the database and handle potential undefined case
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }

    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "uploads" });

    const formData: FormData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    return new Promise((resolve) => {
      const uploadStream = bucket.openUploadStream(file.name, {
        metadata: { contentType: file.type, uploadedAt: new Date() }
      });

      uploadStream.on("error", (error) => {
        console.error("Upload error:", error);
        resolve(NextResponse.json({ error: "Upload failed", details: error.message }, { status: 500 }));
      });

      uploadStream.on("finish", () => {
        resolve(NextResponse.json({ message: "File uploaded successfully", filename: file.name }));
      });

      uploadStream.write(fileBuffer);
      uploadStream.end();
    });
  } catch (error: unknown) {
    console.error("Upload error:", error);
    return NextResponse.json({
      error: "Upload failed",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
};