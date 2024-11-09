import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

interface RouteParams {
  params: {
    sessionId: string;
  };
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = params;

    // Get session details
    const userSession = await prisma.userSession.findFirst({
      where: {
        id: sessionId,
        userId: session.user.id,
      },
      select: {
        id: true,
        deviceInfo: true,
      },
    });

    if (!userSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Check if this is the current session
    const headersList = headers();
    const currentUserAgent = headersList.get("user-agent") || "unknown";
    const sessionUserAgent = JSON.parse(userSession.deviceInfo).userAgent;
    const isCurrentSession = currentUserAgent === sessionUserAgent;

    // Delete session
    await prisma.userSession.delete({
      where: {
        id: sessionId,
      },
    });

    return NextResponse.json({
      message: "Session terminated successfully",
      isCurrentSession,
    });
  } catch (error) {
    console.error("Session termination error:", error);
    return NextResponse.json(
      { error: "Failed to terminate session" },
      { status: 500 }
    );
  }
}
