import type { NextRequest } from "next/server";

/**
 * Configuration for route protection
 * Defines which routes require authentication and which are public
 */

/**
 * Routes that require authentication
 * These patterns will be matched against the pathname
 */
export const PROTECTED_ROUTES = [
  "/dashboard",
  "/profile",
  "/settings",
  "/tasks",
  "/projects",
  "/calendar",
  "/analytics",
  "/integrations",
  "/team",
  "/admin",
] as const;

/**
 * API routes that require authentication
 * These patterns will be matched against API route paths
 */
export const PROTECTED_API_ROUTES = [
  "/api/tasks",
  "/api/projects",
  "/api/user",
  "/api/settings",
  "/api/team",
  "/api/integrations",
  "/api/analytics",
  "/api/trpc", // tRPC endpoints that need auth will be handled by tRPC itself
] as const;

/**
 * Public routes that should never require authentication
 * Even if they match other patterns
 */
export const PUBLIC_ROUTES = [
  "/",
  "/auth/login",
  "/auth/signup",
  "/auth/callback",
  "/auth/reset-password",
  "/auth/verify-email",
  "/auth/error",
  "/about",
  "/pricing",
  "/blog",
  "/docs",
  "/api/health",
  "/api/auth/callback",
] as const;

/**
 * Routes that should be excluded from middleware processing entirely
 * These are typically static assets and Next.js internal routes
 */
export const EXCLUDED_ROUTES = [
  "/_next/static",
  "/_next/image",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.json",
] as const;

/**
 * File extensions to exclude from middleware processing
 */
export const EXCLUDED_EXTENSIONS = [
  "svg",
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
  "ico",
  "pdf",
  "zip",
  "woff",
  "woff2",
  "ttf",
  "eot",
] as const;

/**
 * Check if a pathname requires authentication
 * @param pathname - The pathname to check
 * @returns true if the route requires authentication
 */
export function isProtectedRoute(pathname: string): boolean {
  // First check if it's explicitly public
  if (isPublicRoute(pathname)) {
    return false;
  }

  // Check if it matches any protected route pattern
  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  // Check if it matches any protected API route pattern
  const isProtectedApi = PROTECTED_API_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  return isProtected || isProtectedApi;
}

/**
 * Check if a pathname is explicitly public
 * @param pathname - The pathname to check
 * @returns true if the route is public
 */
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => {
    // Exact match for root path
    if (route === "/") {
      return pathname === "/";
    }
    // For other routes, check if pathname matches exactly or is a sub-path
    // We need to ensure we don't match partial paths
    return pathname === route || pathname.startsWith(route + "/");
  });
}

/**
 * Check if a pathname should be excluded from middleware processing
 * @param pathname - The pathname to check
 * @returns true if the route should be excluded
 */
export function shouldExcludeFromMiddleware(pathname: string): boolean {
  // Check if it matches excluded route patterns
  const isExcludedRoute = EXCLUDED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  if (isExcludedRoute) {
    return true;
  }

  // Check if it has an excluded file extension
  const hasExcludedExtension = EXCLUDED_EXTENSIONS.some((ext) =>
    pathname.endsWith(`.${ext}`),
  );

  return hasExcludedExtension;
}

/**
 * Get the redirect URL for unauthenticated users
 * @param request - The incoming request
 * @returns The URL to redirect to
 */
export function getAuthRedirectUrl(request: NextRequest): string {
  const requestUrl = new URL(request.url);

  // Construct the login URL with return path
  const loginUrl = new URL("/auth/login", request.url);

  // Only add redirectTo if we're not already on a public page
  if (!isPublicRoute(requestUrl.pathname)) {
    const redirectTo = requestUrl.pathname + requestUrl.search;
    loginUrl.searchParams.set("redirectTo", redirectTo);
  }

  return loginUrl.toString();
}

/**
 * Get the post-login redirect URL
 * @param request - The incoming request
 * @returns The URL to redirect to after successful login
 */
export function getPostLoginRedirectUrl(request: NextRequest): string {
  const requestUrl = new URL(request.url);
  const redirectTo = requestUrl.searchParams.get("redirectTo");

  if (redirectTo) {
    // Validate the redirect URL
    // Ensure it's a relative path (security measure)
    if (redirectTo.startsWith("/") && !redirectTo.startsWith("//")) {
      return new URL(redirectTo, request.url).toString();
    }
  }

  // Default redirect to dashboard
  return new URL("/dashboard", request.url).toString();
}

/**
 * Middleware matcher configuration for Next.js
 * This will be used in the middleware config
 */
export const middlewareMatcher = [
  /*
   * Match all request paths except those that should be excluded
   * This uses a negative lookahead to exclude specific patterns
   */
  "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|pdf|zip|woff|woff2|ttf|eot)$).*)",
];
