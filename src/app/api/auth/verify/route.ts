import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(new URL("/auth/verify-error", req.url));
    }

    // Find the verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return NextResponse.redirect(new URL("/auth/verify-error", req.url));
    }

    // Check if token has expired
    if (new Date() > verificationToken.expires) {
      await prisma.verificationToken.delete({
        where: { token },
      });
      return NextResponse.redirect(new URL("/auth/verify-error", req.url));
    }

    // Find and update user
    const user = await prisma.user.findFirst({
      where: {
        email: verificationToken.identifier,
        verificationToken: token,
      },
    });

    if (!user) {
      return NextResponse.redirect(new URL("/auth/verify-error", req.url));
    }

    // Update user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
      },
    });

    // Delete the verification token
    await prisma.verificationToken.delete({
      where: { token },
    });

    // Redirect to success page
    return NextResponse.redirect(new URL("/auth/verify-success", req.url));
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.redirect(new URL("/auth/verify-error", req.url));
  }
}
