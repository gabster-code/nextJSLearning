"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Shield, UserCircle } from "lucide-react";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    pattern: /^\/dashboard$/,
  },
  {
    label: "Profile",
    icon: UserCircle,
    href: "/dashboard/profile",
    pattern: /^\/dashboard\/profile/,
  },
  {
    label: "Sessions",
    icon: Shield,
    href: "/dashboard/sessions",
    pattern: /^\/dashboard\/sessions/,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col space-y-2 w-64 p-4 border-r min-h-[calc(100vh-3.5rem)]">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "flex items-center gap-x-2 text-sm font-medium px-3 py-2 rounded-lg transition-colors",
            route.pattern.test(pathname)
              ? "bg-secondary text-secondary-foreground"
              : "text-muted-foreground hover:text-primary hover:bg-secondary/50"
          )}
        >
          <route.icon className="h-4 w-4" />
          {route.label}
        </Link>
      ))}
    </div>
  );
}
