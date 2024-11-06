import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { saveFile, validateFile } from "@/lib/upload";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file
    try {
      validateFile(file);
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Invalid file" },
        { status: 400 }
      );
    }

    // Save file and get URL
    const imageUrl = await saveFile(file);

    // Update user profile
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { image: imageUrl },
    });

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
