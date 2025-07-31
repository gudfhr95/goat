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
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Sign in to your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email below to sign in to your account
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
                      className="text-sm font-medium text-primary hover:underline"
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
            {isLoading ? "Signing in..." : "Sign in"}
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

      {onSignUpClick && (
        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSignUpClick}
            className="font-medium text-primary hover:underline"
          >
            Sign up
          </button>
        </p>
      )}
    </div>
  );
};
