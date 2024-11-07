import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import * as z from "zod";
import bcrypt from "bcryptjs";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
});

export async function PATCH(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to update your password" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validationResult = passwordSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = validationResult.data;

    // Get user with current password
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        password: true,
      },
    });

    if (!user?.password) {
      return NextResponse.json(
        { error: "No password set for this account" },
        { status: 400 }
      );
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Password update error:", error);
    return NextResponse.json(
      { error: "Failed to update password" },
      { status: 500 }
    );
  }
}
