import { Nav } from "@/components/dashboard/nav";
import { NavUser } from "@/components/dashboard/nav-user";
import { Sidebar } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await NavUser();

  return (
    <>
      <Nav user={user} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="container max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </>
  );
}
