import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    // Validate file types and sizes
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        return NextResponse.json({ 
          error: `File ${file.name} is not an image` 
        }, { status: 400 });
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        return NextResponse.json({ 
          error: `File ${file.name} is too large (max 10MB)` 
        }, { status: 400 });
      }
    }

    const uploadPromises = files.map(file => uploadToCloudinary(file));
    const uploadedUrls = await Promise.all(uploadPromises);
    
    return NextResponse.json({ 
      success: true, 
      files: uploadedUrls 
    });
  } catch (error) {
    
    if (error instanceof Error) {
      return NextResponse.json({ 
        error: "Failed to upload images",
        details: error.message
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      error: "Failed to upload images",
      details: 'Unknown error occurred'
    }, { status: 500 });
  }
}