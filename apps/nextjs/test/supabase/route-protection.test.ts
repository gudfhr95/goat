import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";

import {
  getAuthRedirectUrl,
  getPostLoginRedirectUrl,
  isProtectedRoute,
  isPublicRoute,
  middlewareMatcher,
  PROTECTED_API_ROUTES,
  PROTECTED_ROUTES,
  PUBLIC_ROUTES,
  shouldExcludeFromMiddleware,
} from "../../src/supabase/route-protection";

// Mock NextRequest with proper URL property
vi.mock("next/server", async () => {
  const actual = await import("next/server");
  return {
    ...actual,
    NextRequest: class MockNextRequest {
      url: string;
      nextUrl: URL;
      cookies: {
        getAll: () => never[];
      };
      headers: Headers;

      constructor(url: string) {
        this.url = url;
        this.nextUrl = new URL(url);
        this.cookies = {
          getAll: () => [],
        };
        this.headers = new Headers();
      }
    },
  };
});

describe("route-protection", () => {
  describe("isProtectedRoute", () => {
    it("should identify protected app routes", () => {
      PROTECTED_ROUTES.forEach((route) => {
        expect(isProtectedRoute(route)).toBe(true);
        expect(isProtectedRoute(`${route}/sub-path`)).toBe(true);
      });
    });

    it("should identify protected API routes", () => {
      PROTECTED_API_ROUTES.forEach((route) => {
        expect(isProtectedRoute(route)).toBe(true);
        expect(isProtectedRoute(`${route}/sub-endpoint`)).toBe(true);
      });
    });

    it("should not mark public routes as protected", () => {
      PUBLIC_ROUTES.forEach((route) => {
        expect(isProtectedRoute(route)).toBe(false);
      });
    });

    it("should handle specific protected route cases", () => {
      expect(isProtectedRoute("/dashboard")).toBe(true);
      expect(isProtectedRoute("/dashboard/overview")).toBe(true);
      expect(isProtectedRoute("/profile/settings")).toBe(true);
      expect(isProtectedRoute("/api/tasks/123")).toBe(true);
      expect(isProtectedRoute("/api/trpc/task.create")).toBe(true);
    });

    it("should handle edge cases", () => {
      expect(isProtectedRoute("/dashboards")).toBe(false); // Different route, not a sub-path of /dashboard
      expect(isProtectedRoute("/dash")).toBe(false); // Doesn't match any pattern
      expect(isProtectedRoute("/profile-public")).toBe(false); // Different route
    });
  });

  describe("isPublicRoute", () => {
    it("should identify public routes", () => {
      PUBLIC_ROUTES.forEach((route) => {
        expect(isPublicRoute(route)).toBe(true);
      });
    });

    it("should handle root path correctly", () => {
      expect(isPublicRoute("/")).toBe(true);
      expect(isPublicRoute("/home")).toBe(false);
    });

    it("should handle auth routes correctly", () => {
      expect(isPublicRoute("/auth/login")).toBe(true);
      expect(isPublicRoute("/auth/signup")).toBe(true);
      expect(isPublicRoute("/auth/callback")).toBe(true);
      expect(isPublicRoute("/auth/reset-password")).toBe(true);
      expect(isPublicRoute("/auth/verify-email")).toBe(true);
      expect(isPublicRoute("/auth/error")).toBe(true);
    });

    it("should handle marketing pages", () => {
      expect(isPublicRoute("/about")).toBe(true);
      expect(isPublicRoute("/about/team")).toBe(true);
      expect(isPublicRoute("/pricing")).toBe(true);
      expect(isPublicRoute("/blog")).toBe(true);
      expect(isPublicRoute("/blog/article-1")).toBe(true);
      expect(isPublicRoute("/docs")).toBe(true);
      expect(isPublicRoute("/docs/getting-started")).toBe(true);
    });

    it("should handle API health check", () => {
      expect(isPublicRoute("/api/health")).toBe(true);
      expect(isPublicRoute("/api/auth/callback")).toBe(true);
    });
  });

  describe("shouldExcludeFromMiddleware", () => {
    it("should exclude Next.js internal routes", () => {
      expect(shouldExcludeFromMiddleware("/_next/static/chunks/main.js")).toBe(
        true,
      );
      expect(shouldExcludeFromMiddleware("/_next/image?url=test.jpg")).toBe(
        true,
      );
    });

    it("should exclude static files", () => {
      expect(shouldExcludeFromMiddleware("/favicon.ico")).toBe(true);
      expect(shouldExcludeFromMiddleware("/robots.txt")).toBe(true);
      expect(shouldExcludeFromMiddleware("/sitemap.xml")).toBe(true);
      expect(shouldExcludeFromMiddleware("/manifest.json")).toBe(true);
    });

    it("should exclude files with static extensions", () => {
      expect(shouldExcludeFromMiddleware("/images/logo.svg")).toBe(true);
      expect(shouldExcludeFromMiddleware("/images/hero.png")).toBe(true);
      expect(shouldExcludeFromMiddleware("/photos/team.jpg")).toBe(true);
      expect(shouldExcludeFromMiddleware("/assets/banner.jpeg")).toBe(true);
      expect(shouldExcludeFromMiddleware("/icons/animated.gif")).toBe(true);
      expect(shouldExcludeFromMiddleware("/images/modern.webp")).toBe(true);
      expect(shouldExcludeFromMiddleware("/documents/report.pdf")).toBe(true);
      expect(shouldExcludeFromMiddleware("/downloads/archive.zip")).toBe(true);
      expect(shouldExcludeFromMiddleware("/fonts/inter.woff")).toBe(true);
      expect(shouldExcludeFromMiddleware("/fonts/inter.woff2")).toBe(true);
    });

    it("should not exclude app routes", () => {
      expect(shouldExcludeFromMiddleware("/dashboard")).toBe(false);
      expect(shouldExcludeFromMiddleware("/api/users")).toBe(false);
      expect(shouldExcludeFromMiddleware("/auth/login")).toBe(false);
    });
  });

  describe("getAuthRedirectUrl", () => {
    it("should create login URL with redirectTo parameter", () => {
      const request = new NextRequest("http://localhost:3000/dashboard");
      const redirectUrl = getAuthRedirectUrl(request);
      const url = new URL(redirectUrl);

      expect(url.pathname).toBe("/auth/login");
      expect(url.searchParams.get("redirectTo")).toBe("/dashboard");
    });

    it("should preserve query parameters in redirectTo", () => {
      const request = new NextRequest(
        "http://localhost:3000/tasks?filter=today&status=pending",
      );
      const redirectUrl = getAuthRedirectUrl(request);
      const url = new URL(redirectUrl);

      expect(url.pathname).toBe("/auth/login");
      expect(url.searchParams.get("redirectTo")).toBe(
        "/tasks?filter=today&status=pending",
      );
    });

    it("should not add redirectTo for public pages", () => {
      const request = new NextRequest("http://localhost:3000/about");
      const redirectUrl = getAuthRedirectUrl(request);
      const url = new URL(redirectUrl);

      expect(url.pathname).toBe("/auth/login");
      expect(url.searchParams.get("redirectTo")).toBe(null);
    });

    it("should not add redirectTo for auth pages", () => {
      const request = new NextRequest("http://localhost:3000/auth/signup");
      const redirectUrl = getAuthRedirectUrl(request);
      const url = new URL(redirectUrl);

      expect(url.pathname).toBe("/auth/login");
      expect(url.searchParams.get("redirectTo")).toBe(null);
    });
  });

  describe("getPostLoginRedirectUrl", () => {
    it("should redirect to dashboard by default", () => {
      const request = new NextRequest("http://localhost:3000/auth/login");
      const redirectUrl = getPostLoginRedirectUrl(request);
      const url = new URL(redirectUrl);

      expect(url.pathname).toBe("/dashboard");
    });

    it("should use redirectTo parameter when valid", () => {
      const request = new NextRequest(
        "http://localhost:3000/auth/login?redirectTo=/tasks",
      );
      const redirectUrl = getPostLoginRedirectUrl(request);
      const url = new URL(redirectUrl);

      expect(url.pathname).toBe("/tasks");
    });

    it("should handle redirectTo with query params", () => {
      const request = new NextRequest(
        "http://localhost:3000/auth/login?redirectTo=/tasks?filter=today",
      );
      const redirectUrl = getPostLoginRedirectUrl(request);
      const url = new URL(redirectUrl);

      expect(url.pathname).toBe("/tasks");
      expect(url.search).toBe("?filter=today");
    });

    it("should reject absolute URLs for security", () => {
      const request = new NextRequest(
        "http://localhost:3000/auth/login?redirectTo=https://evil.com",
      );
      const redirectUrl = getPostLoginRedirectUrl(request);
      const url = new URL(redirectUrl);

      expect(url.pathname).toBe("/dashboard"); // Falls back to default
    });

    it("should reject protocol-relative URLs", () => {
      const request = new NextRequest(
        "http://localhost:3000/auth/login?redirectTo=//evil.com",
      );
      const redirectUrl = getPostLoginRedirectUrl(request);
      const url = new URL(redirectUrl);

      expect(url.pathname).toBe("/dashboard"); // Falls back to default
    });

    it("should handle empty redirectTo gracefully", () => {
      const request = new NextRequest(
        "http://localhost:3000/auth/login?redirectTo=",
      );
      const redirectUrl = getPostLoginRedirectUrl(request);
      const url = new URL(redirectUrl);

      expect(url.pathname).toBe("/dashboard"); // Falls back to default
    });
  });

  describe("middlewareMatcher", () => {
    it("should be an array with the correct pattern", () => {
      expect(Array.isArray(middlewareMatcher)).toBe(true);
      expect(middlewareMatcher.length).toBe(1);
      expect(middlewareMatcher[0]).toBe(
        "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|pdf|zip|woff|woff2|ttf|eot)$).*)",
      );
    });

    it("should match app routes when tested with regex", () => {
      const pattern = middlewareMatcher[0];
      if (!pattern) {
        throw new Error("Middleware matcher pattern is missing");
      }

      const appRoutes = [
        "/dashboard",
        "/profile",
        "/api/auth",
        "/auth/login",
        "/tasks/123",
        "/",
      ];

      appRoutes.forEach((route) => {
        // Check that the route doesn't match the exclusion patterns
        const excludePattern =
          /_next\/static|_next\/image|favicon\.ico|robots\.txt|sitemap\.xml|manifest\.json|.*\.(svg|png|jpg|jpeg|gif|webp|ico|pdf|zip|woff|woff2|ttf|eot)$/;
        expect(excludePattern.test(route)).toBe(false);
      });
    });

    it("should not match excluded paths when tested with regex", () => {
      const excludePattern =
        /_next\/static|_next\/image|favicon\.ico|robots\.txt|sitemap\.xml|manifest\.json|.*\.(svg|png|jpg|jpeg|gif|webp|ico|pdf|zip|woff|woff2|ttf|eot)$/;

      const excludedPaths = [
        "/_next/static/chunks/main.js",
        "/_next/image?url=test.jpg",
        "/favicon.ico",
        "/robots.txt",
        "/sitemap.xml",
        "/manifest.json",
        "/logo.svg",
        "/image.png",
        "/photo.jpg",
        "/font.woff",
        "/font.woff2",
        "/doc.pdf",
      ];

      excludedPaths.forEach((path) => {
        expect(excludePattern.test(path)).toBe(true);
      });
    });
  });
});
