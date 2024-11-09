import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your password",
};

interface ResetPasswordPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const token =
    typeof searchParams.token === "string" ? searchParams.token : undefined;

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}
