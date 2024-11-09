import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/session-provider";
import { auth } from "@/auth";
import { Toaster } from "sonner";
import { DevelopmentBanner } from "@/components/development-banner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UserHub - Authentication System",
  description: "A complete user authentication system",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          {isDevelopment && <DevelopmentBanner />}
          <main className="min-h-screen bg-background">{children}</main>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
