import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  context: { params: { sessionId: string } }
) {
  try {
    const session = await auth();
    const sessionId = context.params.sessionId;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the session and ensure it belongs to the user
    const userSession = await prisma.userSession.findUnique({
      where: {
        id: sessionId,
        userId: session.user.id,
      },
    });

    if (!userSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Terminate the session
    await prisma.userSession.update({
      where: { id: sessionId },
      data: { isValid: false },
    });

    // Check if this is the current session
    const isCurrentSession =
      userSession.deviceInfo === req.headers.get("user-agent");

    return NextResponse.json({
      message: "Session terminated",
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
