"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface VerificationStatusProps {
  email: string;
  isVerified: boolean;
}

export function VerificationStatus({
  email,
  isVerified,
}: VerificationStatusProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleResendVerification = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      toast.success("Verification email sent!");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to send verification email"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      {isVerified ? (
        <>
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <span className="text-green-500">Email verified</span>
        </>
      ) : (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <span className="text-yellow-500">Email not verified</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResendVerification}
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Resend verification email"}
          </Button>
        </div>
      )}
    </div>
  );
}
