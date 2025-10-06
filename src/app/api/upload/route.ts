import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploadPromises = files.map(file => uploadToCloudinary(file));
    const uploadedUrls = await Promise.all(uploadPromises);

    return NextResponse.json({ 
      success: true, 
      files: uploadedUrls 
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: "Failed to upload images",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}