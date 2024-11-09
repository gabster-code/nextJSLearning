import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { ProfilePhotoUpload } from "@/components/dashboard/profile-photo-upload";
import { Separator } from "@/components/ui/separator";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const user = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    emailVerified: session.user.emailVerified,
  };

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
          <ProfilePhotoUpload user={user} />
        </div>
        <Separator />
        <div className="divide-y divide-border rounded-md border">
          <ProfileForm user={user} />
        </div>
      </div>
    </div>
  );
}
