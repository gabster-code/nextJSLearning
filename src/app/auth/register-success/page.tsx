import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RegisterSuccessPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="max-w-md text-center space-y-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Check your email
          </h1>
          <p className="text-muted-foreground">
            A verification link has been sent to your email address. Please
            click the link to verify your account.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          If you don't see the email, check your spam folder or{" "}
          <Link
            href="/auth/resend-verification"
            className="text-primary hover:underline"
          >
            click here to resend
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
