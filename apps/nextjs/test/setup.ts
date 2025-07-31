import { vi } from "vitest";

// Mock environment variables
vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-anon-key");

// Mock Next.js modules
vi.mock("next/server", () => ({
  NextRequest: vi.fn(),
  NextResponse: {
    next: vi.fn((init?: unknown) => ({
      cookies: {
        set: vi.fn(),
      },
      ...(init as object),
    })),
  },
}));
