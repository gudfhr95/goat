/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextRequest } from "next/server";
import type { Mock } from "vitest";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { updateSession } from "../../src/supabase/middleware";

// Mock @supabase/ssr
vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(),
}));

// Mock NextResponse
vi.mock("next/server", () => ({
  NextRequest: vi.fn(),
  NextResponse: {
    next: vi.fn((init?: Record<string, unknown>) => ({
      cookies: {
        set: vi.fn(),
      },
      headers: new Headers(),
      ...init,
    })),
    redirect: vi.fn((url: string) => ({
      cookies: {
        set: vi.fn(),
      },
      headers: new Headers(),
      url,
    })),
  },
}));

interface MockSupabaseClient {
  auth: {
    getUser: Mock;
  };
}

describe("updateSession", () => {
  let mockSupabaseClient: MockSupabaseClient;
  let mockRequest: NextRequest;
  let mockCookiesSet: Mock;
  let mockResponseCookiesSet: Mock;

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup mock cookies
    mockCookiesSet = vi.fn();
    mockResponseCookiesSet = vi.fn();

    // Setup mock request
    mockRequest = {
      url: "http://localhost:3000/dashboard",
      nextUrl: {
        pathname: "/dashboard",
      },
      cookies: {
        getAll: vi
          .fn()
          .mockReturnValue([{ name: "sb-auth-token", value: "mock-token" }]),
        set: mockCookiesSet,
      },
      headers: new Headers(),
    } as unknown as NextRequest;

    // Setup mock Supabase client
    mockSupabaseClient = {
      auth: {
        getUser: vi.fn(),
      },
    };

    vi.mocked(createServerClient).mockReturnValue(
      mockSupabaseClient as unknown as ReturnType<typeof createServerClient>,
    );

    // Mock NextResponse.next to return response with cookies
    const mockNext = vi.mocked(NextResponse.next);
    mockNext.mockReturnValue({
      cookies: {
        set: mockResponseCookiesSet,
      },
      headers: new Headers(),
    } as unknown as NextResponse);
  });

  it("should create a Supabase client with correct configuration", async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: { id: "123", email: "test@example.com" } },
      error: null,
    });

    await updateSession(mockRequest);

    expect(createServerClient).toHaveBeenCalledWith(
      "https://test.supabase.co",
      "test-anon-key",
      expect.objectContaining({
        cookies: expect.objectContaining({
          getAll: expect.any(Function) as unknown,
          setAll: expect.any(Function) as unknown,
        }),
      }),
    );
  });

  it("should call getUser to refresh the token", async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: { id: "123", email: "test@example.com" } },
      error: null,
    });

    await updateSession(mockRequest);

    expect(mockSupabaseClient.auth.getUser).toHaveBeenCalledTimes(1);
  });

  it("should handle successful token refresh", async () => {
    const mockUser = { id: "123", email: "test@example.com" };
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    const response = await updateSession(mockRequest);

    expect(response).toBeDefined();
    expect(mockSupabaseClient.auth.getUser).toHaveBeenCalledTimes(1);
  });

  it("should handle getUser errors gracefully", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: { message: "Invalid token" },
    });

    const response = await updateSession(mockRequest);

    expect(response).toBeDefined();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining("Error"),
      expect.stringContaining("Invalid token"),
    );

    consoleErrorSpy.mockRestore();
  });

  it("should handle unexpected errors", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    mockSupabaseClient.auth.getUser.mockRejectedValue(
      new Error("Network error"),
    );

    const response = await updateSession(mockRequest);

    expect(response).toBeDefined();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining("error"),
      expect.any(Error),
    );

    consoleErrorSpy.mockRestore();
  });

  it("should properly handle cookie updates", async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: { id: "123", email: "test@example.com" } },
      error: null,
    });

    await updateSession(mockRequest);

    // Get the cookies configuration from createServerClient call
    const createServerClientMock = vi.mocked(createServerClient);
    const cookiesArg = createServerClientMock.mock.calls[0]?.[2];

    if (!cookiesArg?.cookies) {
      throw new Error("cookies config not found");
    }

    const { cookies: cookiesConfig } = cookiesArg;

    // Test getAll function
    const allCookies = cookiesConfig.getAll();
    expect(allCookies).toEqual([
      { name: "sb-auth-token", value: "mock-token" },
    ]);

    // Test setAll function
    const cookiesToSet = [
      {
        name: "sb-access-token",
        value: "new-token",
        options: { httpOnly: true },
      },
      {
        name: "sb-refresh-token",
        value: "refresh-token",
        options: { httpOnly: true },
      },
    ];

    void cookiesConfig.setAll?.(cookiesToSet);

    // Verify cookies are set on both request and response
    cookiesToSet.forEach(({ name, value, options }) => {
      expect(mockCookiesSet).toHaveBeenCalledWith({ name, value, ...options });
      expect(mockResponseCookiesSet).toHaveBeenCalledWith({
        name,
        value,
        ...options,
      });
    });
  });

  it("should return a NextResponse object", async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: { id: "123", email: "test@example.com" } },
      error: null,
    });

    const response = await updateSession(mockRequest);

    expect(response).toBeDefined();
    expect(response).toHaveProperty("cookies");
    expect(response.cookies).toHaveProperty("set");
  });

  describe("route protection", () => {
    it("should redirect to login when accessing protected route without auth", async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      // Mock NextResponse.redirect
      const mockRedirect = vi.fn().mockReturnValue({
        cookies: { set: vi.fn() },
      });
      vi.mocked(NextResponse).redirect = mockRedirect;

      // Set request to a protected route
      mockRequest.nextUrl.pathname = "/dashboard";

      await updateSession(mockRequest);

      expect(mockRedirect).toHaveBeenCalledWith(
        expect.stringContaining("/auth/login"),
      );
    });

    it("should allow access to protected route with valid auth", async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: "123", email: "test@example.com" } },
        error: null,
      });

      // Set request to a protected route
      mockRequest.nextUrl.pathname = "/dashboard";

      const response = await updateSession(mockRequest);

      // Should return NextResponse.next, not redirect
      expect(response).toBeDefined();
      expect(vi.mocked(NextResponse.next)).toHaveBeenCalled();
    });

    it("should allow access to public routes without auth", async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      // Set request to a public route
      mockRequest.nextUrl.pathname = "/";

      const response = await updateSession(mockRequest);

      // Should return NextResponse.next, not redirect
      expect(response).toBeDefined();
      expect(vi.mocked(NextResponse.next)).toHaveBeenCalled();
    });

    it("should redirect authenticated users from auth pages to dashboard", async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: "123", email: "test@example.com" } },
        error: null,
      });

      // Mock NextResponse.redirect
      const mockRedirect = vi.fn().mockReturnValue({
        cookies: { set: vi.fn() },
        headers: new Headers(),
      });
      vi.mocked(NextResponse).redirect = mockRedirect;

      // Set request to auth login page
      mockRequest.nextUrl.pathname = "/auth/login";

      await updateSession(mockRequest);

      expect(mockRedirect).toHaveBeenCalledWith(
        expect.stringContaining("/dashboard"),
      );
    });

    it("should not redirect from auth callback even when authenticated", async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: "123", email: "test@example.com" } },
        error: null,
      });

      // Set request to auth callback
      mockRequest.nextUrl.pathname = "/auth/callback";

      const response = await updateSession(mockRequest);

      // Should return NextResponse.next, not redirect
      expect(response).toBeDefined();
      expect(vi.mocked(NextResponse.next)).toHaveBeenCalled();
    });
  });
});
