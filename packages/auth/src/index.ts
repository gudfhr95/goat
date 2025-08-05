import {
  createServerClient as createSupabaseServerClient,
  parseCookieHeader,
} from "@supabase/ssr";

import { authEnv } from "../env";

export function createServerClient(cookieHeader: string | null) {
  const env = authEnv();
  const parsedCookies = parseCookieHeader(cookieHeader ?? "");

  return createSupabaseServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          const cookie = parsedCookies.find((c) => c.name === name);
          return cookie?.value;
        },
        set() {
          return undefined;
        },
        remove() {
          return undefined;
        },
      },
    },
  );
}

export { type User, type Session } from "@supabase/supabase-js";
