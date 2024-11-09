"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UploadImage } from "@/components/upload-image";
import { toast } from "sonner";

interface ProfilePhotoUploadProps {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

export function ProfilePhotoUpload({ user }: ProfilePhotoUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(user.image);

  const onUpload = async (url: string) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/user/profile-photo", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: url }),
      });

      if (!response.ok) throw new Error("Failed to update profile photo");

      setImageUrl(url);
      toast.success("Profile photo updated");
      // Force reload to update nav avatar
      window.location.reload();
    } catch (error) {
      toast.error("Error updating profile photo");
    } finally {
      setIsLoading(false);
    }
  };

  const onRemove = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/user/profile-photo", {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to remove profile photo");

      setImageUrl(null);
      toast.success("Profile photo removed");
      // Force reload to update nav avatar
      window.location.reload();
    } catch (error) {
      toast.error("Error removing profile photo");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-x-6">
        <Avatar className="h-20 w-20">
          <AvatarImage src={imageUrl || undefined} />
          <AvatarFallback>{user.name?.[0]}</AvatarFallback>
        </Avatar>
        <div className="space-y-4">
          <div className="flex items-center gap-x-2">
            <UploadImage onUpload={onUpload} />
            {imageUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRemove}
                disabled={isLoading}
              >
                Remove
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Upload a photo for your profile.
          </p>
        </div>
      </div>
    </div>
  );
}
