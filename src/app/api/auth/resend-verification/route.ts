import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email";
import * as z from "zod";

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = emailSchema.parse(body);

    console.log("Attempting to resend verification for:", email);

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        emailVerified: true,
      },
    });

    if (!user) {
      console.log("No user found with email:", email);
      return NextResponse.json(
        { error: "No user found with this email" },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      console.log("Email already verified for:", email);
      return NextResponse.json(
        { error: "Email already verified" },
        { status: 400 }
      );
    }

    // Delete any existing verification tokens
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    // Generate new token
    const { token, expires } = generateVerificationToken();
    console.log("Generated new token for:", email);

    // Save new verification token
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // Update user's verification token
    await prisma.user.update({
      where: { id: user.id },
      data: { verificationToken: token },
    });

    // Send new verification email
    await sendVerificationEmail(email, token);
    console.log("Verification email sent to:", email);

    return NextResponse.json({ message: "Verification email sent" });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "Failed to resend verification email" },
      { status: 500 }
    );
  }
}
