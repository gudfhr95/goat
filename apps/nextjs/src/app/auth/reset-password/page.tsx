import { redirect } from "next/navigation";

import { createClient } from "~/supabase/server";
import { PasswordResetFormWrapper } from "./password-reset-form-wrapper";

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return <PasswordResetFormWrapper />;
}
