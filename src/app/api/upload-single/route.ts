import { NextResponse } from "next/server";
import { uploadBillToCloudinary } from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const uploadedUrl = await uploadBillToCloudinary(file);

    return NextResponse.json({ 
      success: true, 
      url: uploadedUrl 
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: "Failed to upload image",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}