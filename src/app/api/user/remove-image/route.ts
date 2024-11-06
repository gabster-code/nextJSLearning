import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { deleteFile } from "@/lib/upload";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true },
    });

    if (user?.image) {
      // Delete the file from uploads directory
      await deleteFile(user.image);
    }

    // Update user record
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: null },
    });

    return NextResponse.json({ message: "Image removed" });
  } catch (error) {
    console.error("Remove image error:", error);
    return NextResponse.json(
      { error: "Failed to remove image" },
      { status: 500 }
    );
  }
}
