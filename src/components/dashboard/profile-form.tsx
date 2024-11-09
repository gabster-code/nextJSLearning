"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { UploadImage } from "@/components/upload-image";
import { VerificationStatus } from "@/components/dashboard/verification-status";
import { Separator } from "@/components/ui/separator";

const profileFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    emailVerified: Date | null;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Something went wrong");
      }

      toast.success("Profile updated successfully!");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    } finally {
      setIsLoading(false);
    }
  }

  const handleImageUpload = (imageUrl: string) => {
    router.refresh();
  };

  const handleImageRemove = () => {
    router.refresh();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Change your profile picture here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <UploadImage
              currentImage={user.image}
              onUpload={handleImageUpload}
              onRemove={handleImageRemove}
            />
          </div>
        </CardContent>
      </Card>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details here.</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 p-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                    {user.email && (
                      <VerificationStatus
                        email={user.email}
                        isVerified={!!user.emailVerified}
                      />
                    )}
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save changes"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
