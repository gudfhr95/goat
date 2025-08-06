"use client";

import { useState } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";

import { Button } from "@goat/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@goat/ui/components/card";
import { Input } from "@goat/ui/components/input";
import { Label } from "@goat/ui/components/label";
import { cn } from "@goat/ui/lib/utils";

import { resetPassword } from "~/app/auth/actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Sending reset link..." : "Send reset link"}
    </Button>
  );
}

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [errors, setErrors] = useState<{
    email?: string[];
  }>({});
  const [success, setSuccess] = useState<string | null>(null);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Forgot your password?</CardTitle>
          <CardDescription>
            Enter your email address and we&apos;ll send you a password reset
            link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={async (formData) => {
              setErrors({});
              setSuccess(null);

              const result = await resetPassword({
                email: formData.get("email") as string,
              });

              if ("error" in result && result.error) {
                setErrors(result.error);
              } else if ("success" in result && result.success) {
                setSuccess(result.success);
              }
            }}
          >
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email[0]}</p>
                )}
                {success && <p className="text-sm text-green-600">{success}</p>}
              </div>
              <div className="flex flex-col gap-3">
                <SubmitButton />
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Remember your password?{" "}
              <Link href="/auth/login" className="underline underline-offset-4">
                Back to login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
