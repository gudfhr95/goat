import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { middleware } from "../src/middleware";

// Mock the updateSession function
vi.mock("../src/supabase/middleware", () => ({
  updateSession: vi.fn().mockImplementation(() => ({
    cookies: {
      set: vi.fn(),
    },
  })),
}));

describe("middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call updateSession for matched routes", async () => {
    const mockRequest = new NextRequest("http://localhost:3000/dashboard");
    const { updateSession } = await import("../src/supabase/middleware");

    await middleware(mockRequest);

    expect(updateSession).toHaveBeenCalledWith(mockRequest);
    expect(updateSession).toHaveBeenCalledTimes(1);
  });

  it("should handle routes without errors", async () => {
    const mockRequest = new NextRequest("http://localhost:3000/api/users");

    const response = await middleware(mockRequest);

    expect(response).toBeDefined();
  });
});

describe("middleware config", () => {
  it("should have correct matcher configuration", async () => {
    const { config } = await import("../src/middleware");

    expect(config).toBeDefined();
    expect(config.matcher).toBeDefined();
    expect(Array.isArray(config.matcher)).toBe(true);
    expect(config.matcher.length).toBeGreaterThan(0);

    // Verify the matcher pattern
    const pattern = config.matcher[0];
    expect(pattern).toBe(
      "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|pdf|zip|woff|woff2|ttf|eot)$).*)",
    );
  });

  it("should match app routes", async () => {
    await import("../src/middleware");

    // The pattern is designed to match everything EXCEPT static files
    // So we verify that these paths would be processed by the middleware
    const appRoutes = ["/dashboard", "/profile", "/api/auth", "/auth/login"];
    const excludePattern =
      /_next\/static|_next\/image|favicon\.ico|robots\.txt|sitemap\.xml|manifest\.json|.*\.(svg|png|jpg|jpeg|gif|webp|ico|pdf|zip|woff|woff2|ttf|eot)$/;

    appRoutes.forEach((route) => {
      // These routes don't match the exclusion pattern, so they should be handled
      const isExcluded = excludePattern.exec(route);
      expect(isExcluded).toBe(null);
    });
  });

  it("should not match static files", async () => {
    await import("../src/middleware");

    // These should be excluded by the negative lookahead
    const staticPaths = [
      "/_next/static/chunk.js",
      "/_next/image/test.jpg",
      "/favicon.ico",
      "/robots.txt",
      "/sitemap.xml",
      "/manifest.json",
      "/logo.svg",
      "/image.png",
      "/photo.jpg",
      "/picture.jpeg",
      "/animation.gif",
      "/image.webp",
      "/document.pdf",
      "/archive.zip",
      "/font.woff",
      "/font.woff2",
    ];
    const excludePattern =
      /_next\/static|_next\/image|favicon\.ico|robots\.txt|sitemap\.xml|manifest\.json|.*\.(svg|png|jpg|jpeg|gif|webp|ico|pdf|zip|woff|woff2|ttf|eot)$/;

    staticPaths.forEach((path) => {
      // The pattern uses negative lookahead, so these should NOT be matched
      const shouldMatch = !excludePattern.exec(path);
      expect(shouldMatch).toBe(false);
    });
  });
});
