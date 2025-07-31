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
import { FacebookIcon, GoogleIcon, SpinnerIcon } from "../icons";
import { Input } from "../input";

const signupSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export interface SignupFormProps {
  className?: string;
  onSubmit?: (
    values: Omit<SignupFormValues, "confirmPassword">,
  ) => Promise<void>;
  onGoogleSignIn?: () => Promise<void>;
  onFacebookSignIn?: () => Promise<void>;
  onSignInClick?: () => void;
}

export const SignupForm: FC<SignupFormProps> = ({
  className,
  onSubmit,
  onGoogleSignIn,
  onFacebookSignIn,
  onSignInClick,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<
    "google" | "facebook" | null
  >(null);

  const form = useForm({
    schema: signupSchema,
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (values: SignupFormValues) => {
    if (!onSubmit) return;

    try {
      setIsLoading(true);
      await onSubmit({
        email: values.email,
        password: values.password,
      });
    } catch (error) {
      console.error("Signup failed:", error);
      form.setError("root", {
        message: "Failed to create account. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: "google" | "facebook") => {
    const handler = provider === "google" ? onGoogleSignIn : onFacebookSignIn;
    if (!handler) return;

    try {
      setOauthLoading(provider);
      await handler();
    } catch (error) {
      console.error(`${provider} sign up failed:`, error);
      form.setError("root", {
        message: `Failed to sign up with ${provider}. Please try again.`,
      });
    } finally {
      setOauthLoading(null);
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email below to create your account
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

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Create a password"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.formState.errors.root && (
            <div className="rounded-md bg-destructive/10 p-3">
              <p className="text-sm text-destructive">
                {form.formState.errors.root.message}
              </p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || oauthLoading !== null}
          >
            {isLoading && <SpinnerIcon className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {onGoogleSignIn && (
          <Button
            variant="outline"
            onClick={() => handleOAuthSignIn("google")}
            disabled={isLoading || oauthLoading !== null}
          >
            {oauthLoading === "google" ? (
              <>
                <SpinnerIcon className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <GoogleIcon className="mr-2 h-4 w-4" />
                Google
              </>
            )}
          </Button>
        )}

        {onFacebookSignIn && (
          <Button
            variant="outline"
            onClick={() => handleOAuthSignIn("facebook")}
            disabled={isLoading || oauthLoading !== null}
          >
            {oauthLoading === "facebook" ? (
              <>
                <SpinnerIcon className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <FacebookIcon className="mr-2 h-4 w-4" />
                Facebook
              </>
            )}
          </Button>
        )}
      </div>

      {onSignInClick && (
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSignInClick}
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </button>
        </p>
      )}

      <p className="px-8 text-center text-xs text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <a
          href="/terms"
          className="underline underline-offset-4 hover:text-primary"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="/privacy"
          className="underline underline-offset-4 hover:text-primary"
        >
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
};
