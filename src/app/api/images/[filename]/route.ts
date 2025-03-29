import { NextResponse } from "next/server";
import connectDB from "@backend/config/db";
import { GridFSBucket, ObjectId } from "mongodb";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const fileId = params.id;

  if (!ObjectId.isValid(fileId)) {
    return NextResponse.json({ error: "Invalid image ID" }, { status: 400 });
  }

  try {
    const db = await connectDB();
    if (!db) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }

    const file = await db.collection("uploads.files").findOne({ _id: new ObjectId(fileId) });
    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const bucket = new GridFSBucket(db, { bucketName: "uploads" });
    const downloadStream = bucket.openDownloadStream(new ObjectId(fileId));

    const readableStream = new ReadableStream<Uint8Array>({
      start(controller) {
        downloadStream.on("data", (chunk) => controller.enqueue(new Uint8Array(chunk)));
        downloadStream.on("end", () => controller.close());
        downloadStream.on("error", (err) => {
          console.error("Download Stream Error:", err);
          controller.error(err);
        });
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": file.metadata?.contentType || "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("❌ Error fetching image:", error);
    return NextResponse.json({
      error: "Failed to fetch image",
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
