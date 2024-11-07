"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { toast } from "sonner";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormData = z.infer<typeof formSchema>;

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setEmailSent(true);
      toast.success("Reset link sent to your email");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send reset link"
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (emailSent) {
    return (
      <div className="space-y-4">
        <p className="text-center text-sm text-muted-foreground">
          Check your email for a link to reset your password.
        </p>
        <p className="text-center text-sm">
          <Link href="/auth/signin" className="text-primary hover:underline">
            Back to Sign In
          </Link>
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Reset Link"}
        </Button>
        <p className="text-center text-sm">
          Remember your password?{" "}
          <Link href="/auth/signin" className="text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </Form>
  );
}
