"use client";

import type { FC } from "react";
import { useState } from "react";
import { z } from "zod/v4";

import { cn } from "@goat/ui";

import { Button } from "../button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "../form";
import { Input } from "../input";

const passwordResetSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type PasswordResetFormValues = z.infer<typeof passwordResetSchema>;

export interface PasswordResetFormProps {
  className?: string;
  onSubmit?: (values: PasswordResetFormValues) => Promise<void>;
  onBackToSignIn?: () => void;
}

export const PasswordResetForm: FC<PasswordResetFormProps> = ({
  className,
  onSubmit,
  onBackToSignIn,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm({
    schema: passwordResetSchema,
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (values: PasswordResetFormValues) => {
    if (!onSubmit) return;

    try {
      setIsLoading(true);
      await onSubmit(values);
      setIsSuccess(true);
      form.reset();
    } catch (error) {
      console.error("Password reset failed:", error);
      form.setError("root", {
        message: "Failed to send reset email. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="space-y-2 text-center">
          <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <svg
              className="text-primary h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Check your email
          </h1>
          <p className="text-muted-foreground text-sm">
            We've sent a password reset link to your email address.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-muted-foreground text-center text-sm">
            Didn't receive the email? Check your spam folder or{" "}
            <button
              type="button"
              onClick={() => {
                setIsSuccess(false);
                form.reset();
              }}
              className="text-primary font-medium hover:underline"
            >
              try again
            </button>
            .
          </p>

          {onBackToSignIn && (
            <Button
              variant="outline"
              className="w-full"
              onClick={onBackToSignIn}
            >
              Back to sign in
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Forgot your password?
        </h1>
        <p className="text-muted-foreground text-sm">
          No worries, we'll send you reset instructions.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.formState.errors.root && (
            <div className="bg-destructive/10 rounded-md p-3">
              <p className="text-destructive text-sm">
                {form.formState.errors.root.message}
              </p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send reset email"}
          </Button>
        </form>
      </Form>

      {onBackToSignIn && (
        <div className="text-center">
          <button
            type="button"
            onClick={onBackToSignIn}
            className="text-primary text-sm font-medium hover:underline"
          >
            ← Back to sign in
          </button>
        </div>
      )}
    </div>
  );
};
