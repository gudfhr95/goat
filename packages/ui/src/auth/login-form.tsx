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

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export interface LoginFormProps {
  className?: string;
  onSubmit?: (values: LoginFormValues) => Promise<void>;
  onGoogleSignIn?: () => Promise<void>;
  onFacebookSignIn?: () => Promise<void>;
  onForgotPassword?: () => void;
  onSignUpClick?: () => void;
}

export const LoginForm: FC<LoginFormProps> = ({
  className,
  onSubmit,
  onGoogleSignIn,
  onFacebookSignIn,
  onForgotPassword,
  onSignUpClick,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<
    "google" | "facebook" | null
  >(null);

  const form = useForm({
    schema: loginSchema,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: LoginFormValues) => {
    if (!onSubmit) return;

    try {
      setIsLoading(true);
      await onSubmit(values);
    } catch (error) {
      console.error("Login failed:", error);
      form.setError("root", {
        message: "Invalid email or password. Please try again.",
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
      console.error(`${provider} sign in failed:`, error);
      form.setError("root", {
        message: `Failed to sign in with ${provider}. Please try again.`,
      });
    } finally {
      setOauthLoading(null);
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground text-sm">
          Enter your email to sign in to your account
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
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  {onForgotPassword && (
                    <button
                      type="button"
                      onClick={onForgotPassword}
                      className="text-primary text-sm font-medium hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
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

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || oauthLoading !== null}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </Form>

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

      <div className="grid grid-cols-2 gap-4">
        {onGoogleSignIn && (
          <Button
            variant="outline"
            onClick={() => handleOAuthSignIn("google")}
            disabled={isLoading || oauthLoading !== null}
          >
            {oauthLoading === "google" ? (
              "Loading..."
            ) : (
              <>
                <svg
                  className="mr-2 h-4 w-4"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="google"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 488 512"
                >
                  <path
                    fill="currentColor"
                    d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                  />
                </svg>
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
              "Loading..."
            ) : (
              <>
                <svg
                  className="mr-2 h-4 w-4"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="facebook"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                >
                  <path
                    fill="currentColor"
                    d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4.4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z"
                  />
                </svg>
                Facebook
              </>
            )}
          </Button>
        )}
      </div>

      {onSignUpClick && (
        <p className="text-muted-foreground text-center text-sm">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSignUpClick}
            className="text-primary font-medium hover:underline"
          >
            Sign up
          </button>
        </p>
      )}
    </div>
  );
};
