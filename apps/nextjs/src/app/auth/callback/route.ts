import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { createClient } from "~/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Successful authentication, redirect to dashboard or home
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  // Authentication failed or no code provided
  return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`);
}
