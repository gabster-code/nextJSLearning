"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatDeviceInfo } from "@/lib/device-info";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Laptop, Smartphone, Globe } from "lucide-react";
import { signOut } from "next-auth/react";

interface Session {
  id: string;
  deviceInfo: string;
  lastActive: Date;
  ipAddress: string;
}

interface ActiveSessionsProps {
  sessions: Session[];
}

export function ActiveSessions({ sessions }: ActiveSessionsProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [terminatedSessions, setTerminatedSessions] = useState<string[]>([]);

  const handleTerminateSession = async (sessionId: string) => {
    try {
      setIsLoading(sessionId);
      const response = await fetch(`/api/user/sessions/${sessionId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to terminate session");
      }

      // Add to terminated sessions list
      setTerminatedSessions((prev) => [...prev, sessionId]);
      toast.success("Session terminated successfully");

      // If current session was terminated, sign out
      if (data.isCurrentSession) {
        toast.message("Your current session was terminated. Signing out...");
        setTimeout(() => {
          signOut({ callbackUrl: "/auth/signin" });
        }, 2000); // Give time for the toast to be seen
      }
    } catch (error) {
      toast.error("Failed to terminate session");
    } finally {
      setIsLoading(null);
    }
  };

  // Filter out terminated sessions
  const activeSessions = sessions.filter(
    (session) => !terminatedSessions.includes(session.id)
  );

  const getDeviceIcon = (deviceInfo: string) => {
    const info = JSON.parse(deviceInfo);
    switch (info.deviceType) {
      case "mobile":
        return <Smartphone className="h-4 w-4" />;
      case "desktop":
        return <Laptop className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium">Active Sessions</h4>
      </div>
      <div className="divide-y divide-border rounded-md border">
        {activeSessions.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No active sessions
          </div>
        ) : (
          activeSessions.map((session) => {
            const deviceInfo = JSON.parse(session.deviceInfo);
            return (
              <div
                key={session.id}
                className="flex items-center justify-between p-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    {getDeviceIcon(session.deviceInfo)}
                    <span className="font-medium">
                      {formatDeviceInfo(deviceInfo)}
                    </span>
                  </div>
                  <div className="flex space-x-2 text-sm text-muted-foreground">
                    <span>IP: {session.ipAddress}</span>
                    <span>•</span>
                    <span>
                      Last active:{" "}
                      {formatDistanceToNow(new Date(session.lastActive), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTerminateSession(session.id)}
                  disabled={isLoading === session.id}
                >
                  {isLoading === session.id ? "Terminating..." : "Terminate"}
                </Button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
