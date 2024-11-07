import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { getDeviceInfo } from "@/lib/device-info";

export async function POST(req: Request) {
  try {
    const { userId, status, ipAddress } = await req.json();
    const userAgent = req.headers.get("user-agent") || "unknown";
    const deviceInfo = getDeviceInfo(userAgent);

    // Handle local development IP
    const finalIpAddress =
      process.env.NODE_ENV === "development"
        ? "127.0.0.1 (localhost)"
        : ipAddress;

    // Track login attempt in history
    await prisma.loginHistory.create({
      data: {
        userId,
        status,
        ipAddress: finalIpAddress,
        deviceInfo: JSON.stringify(deviceInfo),
      },
    });

    if (status === "success") {
      // Check for existing session with same device info
      const existingSession = await prisma.userSession.findFirst({
        where: {
          userId,
          deviceInfo: JSON.stringify(deviceInfo),
          isValid: true,
        },
      });

      if (existingSession) {
        // Update last active time of existing session
        await prisma.userSession.update({
          where: { id: existingSession.id },
          data: { lastActive: new Date() },
        });
      } else {
        // Create new session if none exists for this device
        await prisma.userSession.create({
          data: {
            userId,
            ipAddress: finalIpAddress,
            deviceInfo: JSON.stringify(deviceInfo),
          },
        });
      }
    }

    return NextResponse.json({ message: "Login tracked successfully" });
  } catch (error) {
    console.error("Track login error:", error);
    return NextResponse.json(
      { error: "Failed to track login" },
      { status: 500 }
    );
  }
}
