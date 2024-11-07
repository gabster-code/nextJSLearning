import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import * as z from "zod";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/email";

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = emailSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return success even if user doesn't exist (security)
      return NextResponse.json({ message: "Reset link sent if email exists" });
    }

    // Delete any existing reset tokens for this email
    await prisma.passwordResetToken.deleteMany({
      where: { email },
    });

    const { token, expires } = generatePasswordResetToken();

    // Save reset token
    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    // Send reset email
    await sendPasswordResetEmail(email, token);

    return NextResponse.json({ message: "Reset link sent if email exists" });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Failed to send reset link" },
      { status: 500 }
    );
  }
}
