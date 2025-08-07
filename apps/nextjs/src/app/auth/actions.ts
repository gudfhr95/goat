"use server";

import { redirect } from "next/navigation";

import {
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "@goat/validators";

import { createClient } from "~/supabase/server";

// Error type for consistent error handling
export interface AuthActionError {
  error: string;
  field?: string;
}

export type AuthActionResponse<T = void> =
  | { success: true; data?: T }
  | { success: false; error: AuthActionError };

/**
 * Sign in with email and password
 */
export async function signIn(formData: FormData): Promise<AuthActionResponse> {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  // Validate input
  const validationResult = signInSchema.safeParse(rawData);
  if (!validationResult.success) {
    const error = validationResult.error.issues[0];
    return {
      success: false,
      error: {
        error: error?.message ?? "Invalid input",
        field: error?.path[0] as string | undefined,
      },
    };
  }

  const { email, password } = validationResult.data;

  // Create Supabase client
  const supabase = await createClient();

  // Attempt to sign in
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Handle specific error cases
    if (error.message === "Invalid login credentials") {
      return {
        success: false,
        error: {
          error: "Invalid email or password",
        },
      };
    }

    if (error.message === "Email not confirmed") {
      return {
        success: false,
        error: {
          error: "Please verify your email before signing in",
        },
      };
    }

    // Network or other errors
    return {
      success: false,
      error: {
        error: "An error occurred during sign in. Please try again.",
      },
    };
  }

  // Successful sign in - redirect to dashboard
  redirect("/dashboard");
}

/**
 * Sign up a new user
 */
export async function signUp(formData: FormData): Promise<AuthActionResponse> {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  // Validate input
  const validationResult = signUpSchema.safeParse(rawData);
  if (!validationResult.success) {
    const error = validationResult.error.issues[0];
    return {
      success: false,
      error: {
        error: error?.message ?? "Invalid input",
        field: error?.path[0] as string | undefined,
      },
    };
  }

  const { email, password } = validationResult.data;

  // Create Supabase client
  const supabase = await createClient();

  // Attempt to sign up
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    // Handle specific error cases
    if (error.message === "User already registered") {
      return {
        success: false,
        error: {
          error: "An account with this email already exists",
          field: "email",
        },
      };
    }

    if (error.message.includes("Password")) {
      return {
        success: false,
        error: {
          error: error.message,
          field: "password",
        },
      };
    }

    // Network or other errors
    return {
      success: false,
      error: {
        error: "An error occurred during sign up. Please try again.",
      },
    };
  }

  // Successful sign up - redirect to verification page
  redirect("/auth/verify-email?email=" + encodeURIComponent(email));
}

/**
 * Request a password reset email
 */
export async function resetPassword(
  formData: FormData,
): Promise<AuthActionResponse> {
  const rawData = {
    email: formData.get("email") as string,
  };

  // Validate input
  const validationResult = resetPasswordSchema.safeParse(rawData);
  if (!validationResult.success) {
    const error = validationResult.error.issues[0];
    return {
      success: false,
      error: {
        error: error?.message ?? "Invalid input",
        field: error?.path[0] as string | undefined,
      },
    };
  }

  const { email } = validationResult.data;

  // Create Supabase client
  const supabase = await createClient();

  // Request password reset
  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    // Don't reveal whether email exists for security
    // Always show success message
    return {
      success: true,
    };
  }

  // Always return success to prevent email enumeration
  return {
    success: true,
  };
}

/**
 * Sign in with OAuth provider (Google, Facebook, etc.)
 */
export async function signInWithOAuth(
  provider: "google" | "facebook",
): Promise<void> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
  });

  if (error) {
    throw new Error(`OAuth sign in failed: ${error.message}`);
  }

  if (data.url) {
    redirect(data.url);
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(`Sign out failed: ${error.message}`);
  }

  redirect("/");
}
