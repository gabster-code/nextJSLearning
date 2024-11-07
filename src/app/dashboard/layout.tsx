import { DashboardNav } from "@/components/dashboard/nav";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LayoutDashboard, User, Lock } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardNav />
      <div className="container flex-1 items-start md:grid md:grid-cols-[200px_1fr] md:gap-6 md:p-6">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
          <div className="space-y-2 py-4 pr-4">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/dashboard/profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/dashboard/sessions">
                <Lock className="mr-2 h-4 w-4" />
                Sessions & Security
              </Link>
            </Button>
          </div>
        </aside>
        <main className="flex w-full flex-col overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
