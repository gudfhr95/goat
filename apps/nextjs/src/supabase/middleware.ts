import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { env } from "~/env";
import {
  getAuthRedirectUrl,
  getPostLoginRedirectUrl,
  isProtectedRoute,
} from "./route-protection";

/**
 * Middleware logger for debugging
 * Only logs in development mode for performance
 */
const isDevelopment = env.NODE_ENV === "development";

const logger = {
  debug: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.debug(`[Middleware] ${message}`, ...args);
    }
  },
  error: (message: string, error: unknown) => {
    console.error(`[Middleware] ${message}`, error);
  },
  time: (label: string) => {
    if (isDevelopment) {
      console.time(`[Middleware] ${label}`);
    }
  },
  timeEnd: (label: string) => {
    if (isDevelopment) {
      console.timeEnd(`[Middleware] ${label}`);
    }
  },
};

/**
 * Performance tracking for middleware execution
 */
class PerformanceTracker {
  private start: number;
  private marks: Map<string, number>;

  constructor() {
    this.start = Date.now();
    this.marks = new Map();
  }

  mark(name: string) {
    this.marks.set(name, Date.now() - this.start);
  }

  getMetrics() {
    return {
      total: Date.now() - this.start,
      marks: Object.fromEntries(this.marks),
    };
  }
}

/**
 * Updates the user session and handles authentication flow
 * @param request - The incoming Next.js request
 * @returns A Next.js response with updated session cookies
 */
export async function updateSession(request: NextRequest) {
  const perf = new PerformanceTracker();
  const pathname = request.nextUrl.pathname;
  const requestId = crypto.randomUUID();

  logger.debug(`Processing request ${requestId} for ${pathname}`);
  logger.time(`Request ${requestId}`);

  try {
    // Create a response object that we can modify
    const response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    // Add request ID to response headers for tracing
    response.headers.set("x-request-id", requestId);

    perf.mark("response-created");

    // Check route protection status
    const isProtected = isProtectedRoute(pathname);
    const isAuthPage =
      pathname.startsWith("/auth/") && pathname !== "/auth/callback";

    perf.mark("route-check");

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

    perf.mark("supabase-client-created");

    // Skip auth check entirely for public routes that are not auth pages (performance optimization)
    if (!isProtected && !isAuthPage) {
      logger.debug(`Skipping auth check for public route: ${pathname}`);
      logger.timeEnd(`Request ${requestId}`);
      return response;
    }

    // Check if we have a session cookie first (performance optimization)
    const hasSessionCookie = request.cookies
      .getAll()
      .some(
        (cookie) =>
          cookie.name.includes("sb-") && cookie.name.includes("-auth-token"),
      );

    if (!hasSessionCookie && isProtected) {
      logger.debug(
        "No session cookie found for protected route, redirecting to login",
      );
      const redirectUrl = getAuthRedirectUrl(request);
      logger.timeEnd(`Request ${requestId}`);
      return NextResponse.redirect(redirectUrl);
    }

    // Refresh the auth token by calling getUser()
    // This will validate the token with Supabase Auth server and refresh if needed
    let user = null;

    try {
      const {
        data: { user: sessionUser },
        error,
      } = await supabase.auth.getUser();

      perf.mark("auth-check-complete");
      user = sessionUser;

      if (error) {
        // Log the error but don't throw - let the request continue
        // The user will be treated as unauthenticated
        if (error.message !== "Auth session missing!") {
          logger.error("Error refreshing auth token:", error.message);
        }
      }

      // The token refresh (if needed) is handled automatically by getUser()
      // and the updated cookies are already set in the response
    } catch (error) {
      // Handle any unexpected errors during token refresh
      logger.error("Unexpected error in auth check:", error);

      // For critical errors, we should fail safe and redirect to login for protected routes
      if (isProtected) {
        const redirectUrl = getAuthRedirectUrl(request);
        logger.timeEnd(`Request ${requestId}`);
        return NextResponse.redirect(redirectUrl);
      }
    }

    // If the route is protected and user is not authenticated, redirect to login
    if (isProtected && !user) {
      logger.debug(
        "User not authenticated for protected route, redirecting to login",
      );
      const redirectUrl = getAuthRedirectUrl(request);
      logger.timeEnd(`Request ${requestId}`);
      return NextResponse.redirect(redirectUrl);
    }

    // If user is authenticated and trying to access auth pages, redirect to dashboard
    if (user && isAuthPage) {
      logger.debug(
        "Authenticated user accessing auth page, redirecting to dashboard",
      );
      const postLoginUrl = getPostLoginRedirectUrl(request);
      logger.timeEnd(`Request ${requestId}`);
      return NextResponse.redirect(postLoginUrl);
    }

    // Log performance metrics in development
    if (isDevelopment) {
      const metrics = perf.getMetrics();
      logger.debug(`Performance metrics for ${requestId}:`, metrics);
    }

    logger.timeEnd(`Request ${requestId}`);
    return response;
  } catch (error) {
    // Catch-all error handler to prevent middleware crashes
    logger.error(
      `Critical error in middleware for request ${requestId}:`,
      error,
    );

    // For critical errors, return a safe response
    // Don't redirect to avoid infinite loops
    const response = NextResponse.next();
    response.headers.set("x-middleware-error", "true");
    response.headers.set("x-request-id", requestId);

    logger.timeEnd(`Request ${requestId}`);
    return response;
  }
}
