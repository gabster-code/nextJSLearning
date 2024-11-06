import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function VerifySuccessPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Email verified successfully!
          </h1>
          <p className="text-muted-foreground">
            Your email has been verified. You can now sign in to your account.
          </p>
        </div>
        <Button asChild>
          <Link href="/auth/signin">Continue to Sign In</Link>
        </Button>
      </div>
    </div>
  );
}
