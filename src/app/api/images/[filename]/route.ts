import { NextResponse } from "next/server";
import connectDB from "@backend/config/db"; 
import { MongoClient, GridFSBucket } from "mongodb"; 
import mongoose from "mongoose"; 

export async function GET(request: Request) { 
  // Extract filename from URL
  const url = new URL(request.url);
  const pathname = url.pathname;
  const filename = pathname.split('/').pop();

  if (!filename) {  
    return NextResponse.json({ error: "Filename is required" }, { status: 400 }); 
  }
  
  try { 
    // Kết nối MongoDB 
    await connectDB(); 
    if (mongoose.connection.readyState !== 1) { 
      console.error("❌ MongoDB connection failed"); 
      return NextResponse.json({ error: "MongoDB connection failed" }, { status: 500 }); 
    } 
 
    // Kết nối database 
    const connection = mongoose.connection;
    const dbName = connection.db?.databaseName || connection.name || "test";
    
    // Create a new MongoClient instance using mongoose's connection string
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      return NextResponse.json({ error: "Database connection URI not found" }, { status: 500 });
    }

    const client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db(dbName);
 
    // Kiểm tra file tồn tại 
    const file = await db.collection("uploads.files").findOne({ filename }); 
    if (!file) { 
      await client.close();
      return NextResponse.json({ error: "File not found" }, { status: 404 }); 
    } 
 
    // Lấy ảnh từ GridFS 
    const bucket = new GridFSBucket(db, { bucketName: "uploads" }); 
    const downloadStream = bucket.openDownloadStreamByName(filename); 
 
    // Chuyển đổi stream thành ReadableStream cho Next.js 
    const readableStream = new ReadableStream({ 
      start(controller) { 
        downloadStream.on("data", (chunk) => controller.enqueue(chunk)); 
        downloadStream.on("end", () => {
          controller.close();
          client.close(); // Ensure client is closed
        });
        downloadStream.on("error", (err) => {
          controller.error(err);
          client.close(); // Ensure client is closed on error
        }); 
      }, 
    }); 
 
    return new NextResponse(readableStream, { 
      headers: { 
        "Content-Type": file.metadata?.contentType || "image/jpeg", 
        "Cache-Control": "public, max-age=31536000, immutable", 
      }, 
    }); 
  } catch (error) { 
    console.error("❌ Error fetching image:", error); 
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 }); 
  } 
}