import { NextResponse } from "next/server";
import connectDB from "@backend/config/db"; 
import { MongoClient, GridFSBucket } from "mongodb"; 
import mongoose from "mongoose"; 

export async function GET(request: Request) { 
  const url = new URL(request.url);
  const pathname = url.pathname;
  const filename = decodeURIComponent(pathname.split('/').pop() || '');

  if (!filename) {  
    return NextResponse.json({ error: "Filename is required" }, { status: 400 }); 
  }
  
  let client: MongoClient | null = null;
  
  try { 
    await connectDB(); 
    
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      return NextResponse.json({ error: "Database connection URI not found" }, { status: 500 });
    }

    client = new MongoClient(mongoUri);
    await client.connect();
    
    const db = client.db(mongoose.connection.db?.databaseName || 'test');
 
    const file = await db.collection("uploads.files").findOne({ filename }); 
    if (!file) { 
      await client.close();
      return NextResponse.json({ error: "File not found" }, { status: 404 }); 
    } 
 
    const bucket = new GridFSBucket(db, { bucketName: "uploads" }); 
    const downloadStream = bucket.openDownloadStreamByName(filename); 
 
    const readableStream = new ReadableStream({ 
      start(controller) { 
        downloadStream.on("data", (chunk) => controller.enqueue(chunk)); 
        downloadStream.on("end", () => {
          controller.close();
          client?.close(); 
        });
        downloadStream.on("error", (err) => {
          console.error("Download Stream Error:", err);
          controller.error(err);
          client?.close(); 
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
    client?.close();
    return NextResponse.json({ 
      error: "Failed to fetch image", 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 }); 
  } 
}