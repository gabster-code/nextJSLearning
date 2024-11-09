import { ResetPasswordForm } from "@/components/auth/reset-password-form";

type SearchParams = Promise<{ token?: string }>;

interface ResetPasswordPageProps {
  searchParams: SearchParams;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;
  const token = params.token;

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}
