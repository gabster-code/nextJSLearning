import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // Get fresh user data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
    },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <pre className="mt-4 p-4 bg-slate-100 rounded">
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  );
}
