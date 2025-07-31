import { redirect } from "next/navigation";

import { createClient } from "~/supabase/server";
import { LoginFormWrapper } from "./login-form-wrapper";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return <LoginFormWrapper />;
}
