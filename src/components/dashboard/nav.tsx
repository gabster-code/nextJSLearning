import { SignOutButton } from "@/components/auth/signout-button";
import { auth } from "@/auth";

export async function DashboardNav() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-4">
          <a href="/dashboard" className="font-bold">
            UserHub
          </a>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name || ""}
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            <span className="text-sm font-medium">{user?.name}</span>
          </div>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
