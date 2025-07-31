"use client";

import { useRouter } from "next/navigation";

import { LoginForm } from "@goat/ui";

import { createClient } from "~/supabase/client";

export function LoginFormWrapper() {
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (values: { email: string; password: string }) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
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

  const handleForgotPassword = () => {
    router.push("/auth/reset-password");
  };

  const handleSignUpClick = () => {
    router.push("/auth/signup");
  };

  return (
    <>
      <LoginForm
        onSubmit={handleSubmit}
        onGoogleSignIn={handleGoogleSignIn}
        onFacebookSignIn={handleFacebookSignIn}
        onForgotPassword={handleForgotPassword}
        onSignUpClick={handleSignUpClick}
      />
    </>
  );
}
