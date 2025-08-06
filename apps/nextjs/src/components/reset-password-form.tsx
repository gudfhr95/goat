"use client";

import { useState } from "react";
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

import { updatePassword } from "~/app/auth/actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Updating password..." : "Update password"}
    </Button>
  );
}

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Reset your password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={async (formData) => {
              setError(null);

              const password = formData.get("password") as string;
              const confirmPassword = formData.get("confirmPassword") as string;

              if (password !== confirmPassword) {
                setError("Passwords do not match");
                return;
              }

              if (password.length < 8) {
                setError("Password must be at least 8 characters");
                return;
              }

              await updatePassword(password);
            }}
          >
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="At least 8 characters"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  required
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div className="flex flex-col gap-3">
                <SubmitButton />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
