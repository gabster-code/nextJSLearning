import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { ActiveSessions } from "@/components/dashboard/active-sessions";
import { LoginHistory } from "@/components/dashboard/login-history";
import { cache } from "react";

// Cache the session data fetching
const getSessionData = cache(async (userId: string) => {
  try {
    const [activeSessions, loginHistory] = await Promise.all([
      prisma.userSession.findMany({
        where: {
          userId,
          isValid: true,
        },
        orderBy: {
          lastActive: "desc",
        },
        select: {
          id: true,
          deviceInfo: true,
          ipAddress: true,
          lastActive: true,
        },
      }),
      prisma.loginHistory.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
        select: {
          id: true,
          status: true,
          deviceInfo: true,
          ipAddress: true,
          createdAt: true,
        },
      }),
    ]);

    return { activeSessions, loginHistory };
  } catch (error) {
    console.error("Error fetching session data:", error);
    return { activeSessions: [], loginHistory: [] };
  }
});

export default async function SessionsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const { activeSessions, loginHistory } = await getSessionData(
    session.user.id
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Sessions & Security</h3>
        <p className="text-sm text-muted-foreground">
          Manage your active sessions and view login history.
        </p>
      </div>
      <div className="space-y-6">
        <ActiveSessions sessions={activeSessions} />
        <LoginHistory history={loginHistory} />
      </div>
    </div>
  );
}
