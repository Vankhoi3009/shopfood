import { NextRequest, NextResponse } from "next/server";
import { Db, GridFSBucket } from "mongodb";
import mongoose from "mongoose";
import connectDB from "@backend/config/db";

export async function POST(req: NextRequest) {
  try {
    // Kết nối database
    await connectDB();

    // Kiểm tra trạng thái kết nối
    if (mongoose.connection.readyState !== 1) {
      return NextResponse.json({ error: "Database not connected" }, { status: 500 });
    }

    // Lấy client và database
    const client = mongoose.connection.getClient();
    const dbName = mongoose.connection.db?.databaseName || 'test';
    const db = client.db(dbName) as Db;

    // Tạo GridFS bucket
    const bucket = new GridFSBucket(db, { bucketName: "uploads" });

    // Lấy form data
    const form = await req.formData();
    const file = form.get("file") as File;

    // Kiểm tra file
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Chuyển đổi file thành buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Trả về Promise để xử lý upload
    return new Promise<Response>((resolve, reject) => {
      // Mở luồng upload
      const uploadStream = bucket.openUploadStream(file.name, {
        metadata: { 
          contentType: file.type,
          originalName: file.name,
          uploadedAt: new Date()
        }
      });

      // Xử lý sự kiện lỗi
      uploadStream.on('error', (error) => {
        console.error('Upload error:', error);
        reject(NextResponse.json({ 
          error: "Upload failed", 
          details: error.message 
        }, { status: 500 }));
      });

      // Xử lý sự kiện hoàn thành
      uploadStream.on('finish', () => {
        resolve(NextResponse.json({ 
          message: "File uploaded successfully",
          filename: file.name,
          contentType: file.type,
          size: fileBuffer.length
        }));
      });

      // Ghi file vào stream
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

// Cấu hình để cho phép tải file lớn
export const config = {
  api: {
    bodyParser: false
  }
};