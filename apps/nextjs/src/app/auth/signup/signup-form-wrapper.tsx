"use client";

import { useRouter } from "next/navigation";

import { SignupForm } from "@goat/ui";

import { createClient } from "~/supabase/client";

export function SignupFormWrapper() {
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (values: { email: string; password: string }) => {
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      throw error;
    }

    router.refresh();
    router.push("/");
  };

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      throw error;
    }
  };

  const handleFacebookSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      throw error;
    }
  };

  const handleSignInClick = () => {
    router.push("/auth/login");
  };

  return (
    <SignupForm
      onSubmit={handleSubmit}
      onGoogleSignIn={handleGoogleSignIn}
      onFacebookSignIn={handleFacebookSignIn}
      onSignInClick={handleSignInClick}
    />
  );
}
