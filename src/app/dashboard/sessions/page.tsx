import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatDeviceInfo } from "@/lib/device-info";
import { format } from "date-fns";
import { ActiveSessions } from "@/components/dashboard/active-sessions";
import { LoginHistory } from "@/components/dashboard/login-history";

export default async function SessionsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // Get active sessions for current user only
  const activeSessions = await prisma.userSession.findMany({
    where: {
      userId: session.user.id, // Filter by current user's ID
      isValid: true,
    },
    orderBy: {
      lastActive: "desc",
    },
  });

  // Get login history for current user only
  const loginHistory = await prisma.loginHistory.findMany({
    where: {
      userId: session.user.id, // Filter by current user's ID
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10, // Last 10 login attempts
  });

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
