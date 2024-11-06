import { writeFile, unlink } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function saveFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create unique filename
  const fileName = `${uuidv4()}-${file.name}`;
  const filePath = path.join(process.cwd(), "public/uploads", fileName);

  // Save file
  await writeFile(filePath, buffer);

  // Return the public URL
  return `/uploads/${fileName}`;
}

export async function deleteFile(fileUrl: string) {
  try {
    const filePath = path.join(process.cwd(), "public", fileUrl);
    await unlink(filePath);
  } catch (error) {
    console.error("Error deleting file:", error);
  }
}

// Helper to validate file
export function validateFile(file: File) {
  const validTypes = ["image/jpeg", "image/png", "image/webp"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    throw new Error(
      "Invalid file type. Please upload a JPEG, PNG, or WebP image."
    );
  }

  if (file.size > maxSize) {
    throw new Error("File too large. Maximum size is 5MB.");
  }

  return true;
}
