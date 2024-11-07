import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { PasswordForm } from "@/components/dashboard/password-form";
import { prisma } from "@/lib/db";
import { Separator } from "@/components/ui/separator";
import { DeleteAccountForm } from "@/components/dashboard/delete-account-form";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      emailVerified: true,
    },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          Manage your profile information.
        </p>
      </div>
      <div className="space-y-6">
        <div className="divide-y divide-border rounded-md border">
          <ProfileForm user={user} />
        </div>
        <Separator />
        <div>
          <h3 className="text-lg font-medium">Password</h3>
          <p className="text-sm text-muted-foreground">Change your password.</p>
        </div>
        <div className="divide-y divide-border rounded-md border">
          <PasswordForm />
        </div>
      </div>
      <Separator />
      <div className="divide-y divide-border rounded-md border">
        <div className="p-4">
          <DeleteAccountForm />
        </div>
      </div>
    </div>
  );
}
