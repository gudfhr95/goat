"use client";

import { useRouter } from "next/navigation";

import { PasswordResetForm } from "@goat/ui";

import { createClient } from "~/supabase/client";

export function PasswordResetFormWrapper() {
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (values: { email: string }) => {
    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/update-password`,
    });

    if (error) {
      throw error;
    }
  };

  const handleBackToSignIn = () => {
    router.push("/auth/login");
  };

  return (
    <PasswordResetForm
      onSubmit={handleSubmit}
      onBackToSignIn={handleBackToSignIn}
    />
  );
}
