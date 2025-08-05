import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { env } from "~/env";
import {
  getAuthRedirectUrl,
  getPostLoginRedirectUrl,
  isProtectedRoute,
} from "./route-protection";

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Create a response object that we can modify
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create a Supabase client with cookie handling for middleware
  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set({ name, value, ...options });
            response.cookies.set({ name, value, ...options });
          });
        },
      },
    },
  );

  // Refresh the auth token by calling getUser()
  // This will validate the token with Supabase Auth server and refresh if needed
  let user = null;

  try {
    const {
      data: { user: sessionUser },
      error,
    } = await supabase.auth.getUser();

    user = sessionUser;

    if (error) {
      // Log the error but don't throw - let the request continue
      // The user will be treated as unauthenticated
      console.error("Error refreshing auth token:", error.message);
    }

    // The token refresh (if needed) is handled automatically by getUser()
    // and the updated cookies are already set in the response
  } catch (error) {
    // Handle any unexpected errors during token refresh
    console.error("Unexpected error in auth middleware:", error);
  }

  // Check route protection requirements
  const isProtected = isProtectedRoute(pathname);

  // If the route is protected and user is not authenticated, redirect to login
  if (isProtected && !user) {
    const redirectUrl = getAuthRedirectUrl(request);
    return NextResponse.redirect(redirectUrl);
  }

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (user && pathname.startsWith("/auth/") && pathname !== "/auth/callback") {
    const postLoginUrl = getPostLoginRedirectUrl(request);
    return NextResponse.redirect(postLoginUrl);
  }

  return response;
}
