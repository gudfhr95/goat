import type { NextRequest } from "next/server";

import { updateSession } from "~/supabase/middleware";
import { middlewareMatcher } from "~/supabase/route-protection";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: middlewareMatcher,
};
