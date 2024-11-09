import { ResetPasswordForm } from "@/components/auth/reset-password-form";

interface ResetPasswordPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const token = searchParams.token as string | undefined;

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}
