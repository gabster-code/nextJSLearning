"use client";

export function DevelopmentBanner() {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV !== "production") {
    return (
      <div className="bg-yellow-500 text-black px-4 py-1 text-center text-sm font-medium">
        🚧 Development Environment 🚧
      </div>
    );
  }
  return null;
}
