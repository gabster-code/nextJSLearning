import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/dashboard/profile-form";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
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
      <div className="divide-y divide-border rounded-md border">
        <ProfileForm
          user={{
            id: session.user.id,
            name: session.user.name || null,
            email: session.user.email || null,
          }}
        />
      </div>
    </div>
  );
}
