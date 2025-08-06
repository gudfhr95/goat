"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type {
  ResetPasswordInput,
  SignInInput,
  SignUpInput,
} from "@goat/validators";
import {
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "@goat/validators";

import { createClient } from "~/supabase/server";

async function getOrigin() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

export async function signIn(input: SignInInput) {
  // Validate input
  const validatedInput = signInSchema.safeParse(input);
  if (!validatedInput.success) {
    return {
      error: validatedInput.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: validatedInput.data.email,
    password: validatedInput.data.password,
  });

  if (error) {
    if (error.message === "Invalid login credentials") {
      return {
        error: {
          email: ["Invalid email or password"],
          password: ["Invalid email or password"],
        },
      };
    }

    // Handle other errors
    return {
      error: {
        email: [error.message],
      },
    };
  }

  // Redirect to dashboard on success
  redirect("/dashboard");
}

export async function signUp(input: SignUpInput) {
  // Validate input
  const validatedInput = signUpSchema.safeParse(input);
  if (!validatedInput.success) {
    return {
      error: validatedInput.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: validatedInput.data.email,
    password: validatedInput.data.password,
  });

  if (error) {
    if (error.message.includes("already registered")) {
      return {
        error: {
          email: ["This email is already registered"],
        },
      };
    }

    // Handle other errors
    return {
      error: {
        email: [error.message],
      },
    };
  }

  // Redirect to verification pending page or dashboard
  redirect("/auth/verify-email");
}

export async function resetPassword(input: ResetPasswordInput) {
  // Validate input
  const validatedInput = resetPasswordSchema.safeParse(input);
  if (!validatedInput.success) {
    return {
      error: validatedInput.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const origin = await getOrigin();

  const { error } = await supabase.auth.resetPasswordForEmail(
    validatedInput.data.email,
    {
      redirectTo: `${origin}/auth/reset-password`,
    },
  );

  if (error) {
    return {
      error: {
        email: [error.message],
      },
    };
  }

  // Return success message
  return {
    success: "Check your email for a password reset link",
  };
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const origin = await getOrigin();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function signInWithFacebook() {
  const supabase = await createClient();
  const origin = await getOrigin();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "facebook",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function updatePassword(newPassword: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return {
      error: error.message,
    };
  }

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      error: error.message,
    };
  }

  redirect("/");
}
