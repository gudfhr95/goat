import { redirect } from "next/navigation";

import { createClient } from "~/supabase/server";
import { SignupFormWrapper } from "./signup-form-wrapper";

export default async function SignupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return <SignupFormWrapper />;
}
