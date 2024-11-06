import { Button } from "@/components/ui/button";
import Link from "next/link";
import { XCircle } from "lucide-react";

export default function VerifyErrorPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <XCircle className="h-12 w-12 text-red-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Verification failed
          </h1>
          <p className="text-muted-foreground">
            The verification link is invalid or has expired. Please try
            requesting a new verification email.
          </p>
        </div>
        <div className="space-y-2">
          <Button asChild variant="default">
            <Link href="/auth/resend-verification">
              Request new verification email
            </Link>
          </Button>
          <div className="pt-2">
            <Button asChild variant="outline">
              <Link href="/auth/signin">Back to Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
