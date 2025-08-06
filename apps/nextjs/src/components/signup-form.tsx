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

import { signInWithGoogle, signUp } from "~/app/auth/actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Creating account..." : "Sign up"}
    </Button>
  );
}

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [errors, setErrors] = useState<{
    email?: string[];
    password?: string[];
  }>({});

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={async (formData) => {
              const result = await signUp({
                email: formData.get("email") as string,
                password: formData.get("password") as string,
              });

              if ("error" in result) {
                setErrors(result.error);
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
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="At least 8 characters"
                  required
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password[0]}</p>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <SubmitButton />
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="underline underline-offset-4">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background text-muted-foreground px-2">
            Or continue with
          </span>
        </div>
      </div>

      <form>
        <Button
          variant="outline"
          className="w-full"
          formAction={signInWithGoogle}
        >
          Sign up with Google
        </Button>
      </form>
    </div>
  );
}
