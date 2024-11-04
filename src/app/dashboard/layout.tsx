import { DashboardNav } from "@/components/dashboard/nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <DashboardNav />
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <nav className="flex flex-1 flex-col space-y-2">
            <a
              href="/dashboard"
              className="flex items-center space-x-2 rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100"
            >
              Overview
            </a>
            <a
              href="/dashboard/profile"
              className="flex items-center space-x-2 rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100"
            >
              Profile
            </a>
            <a
              href="/dashboard/settings"
              className="flex items-center space-x-2 rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100"
            >
              Settings
            </a>
          </nav>
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
