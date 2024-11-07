"use client";

import { formatDistanceToNow } from "date-fns";
import { formatDeviceInfo } from "@/lib/device-info";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface LoginAttempt {
  id: string;
  status: string;
  deviceInfo: string;
  ipAddress: string;
  createdAt: Date;
}

interface LoginHistoryProps {
  history: LoginAttempt[];
}

export function LoginHistory({ history }: LoginHistoryProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "blocked":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium">Login History</h4>
      </div>
      <div className="divide-y divide-border rounded-md border">
        {history.map((attempt) => {
          const deviceInfo = JSON.parse(attempt.deviceInfo);
          return (
            <div
              key={attempt.id}
              className="flex items-center justify-between p-4"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(attempt.status)}
                  <span className="font-medium">
                    {formatDeviceInfo(deviceInfo)}
                  </span>
                </div>
                <div className="flex space-x-2 text-sm text-muted-foreground">
                  <span>IP: {attempt.ipAddress}</span>
                  <span>•</span>
                  <span>
                    {formatDistanceToNow(new Date(attempt.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
              <div
                className={`text-sm ${
                  attempt.status === "success"
                    ? "text-green-500"
                    : attempt.status === "failed"
                    ? "text-red-500"
                    : "text-yellow-500"
                }`}
              >
                {attempt.status.charAt(0).toUpperCase() +
                  attempt.status.slice(1)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
