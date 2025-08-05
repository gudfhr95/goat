import type { User } from "@supabase/supabase-js";
import type { NextResponse } from "next/server";

/**
 * Middleware context containing auth state and request info
 */
export interface MiddlewareContext {
  user: User | null;
  pathname: string;
  requestId: string;
  isProtected: boolean;
}

/**
 * Performance metrics collected during middleware execution
 */
export interface MiddlewareMetrics {
  total: number;
  marks: Record<string, number>;
}

/**
 * Middleware error types for better error handling
 */
export enum MiddlewareErrorType {
  AUTH_CHECK_FAILED = "AUTH_CHECK_FAILED",
  SESSION_REFRESH_FAILED = "SESSION_REFRESH_FAILED",
  SUPABASE_CLIENT_ERROR = "SUPABASE_CLIENT_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

/**
 * Custom middleware error with additional context
 */
export class MiddlewareError extends Error {
  constructor(
    public type: MiddlewareErrorType,
    message: string,
    public context?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "MiddlewareError";
  }
}

/**
 * Middleware response type with additional headers
 */
export type MiddlewareResponse = NextResponse & {
  headers: Headers & {
    "x-request-id"?: string;
    "x-middleware-error"?: string;
    "x-auth-status"?: "authenticated" | "unauthenticated" | "error";
  };
};

/**
 * Logger interface for middleware
 */
export interface MiddlewareLogger {
  debug: (message: string, ...args: unknown[]) => void;
  error: (message: string, error: unknown) => void;
  time: (label: string) => void;
  timeEnd: (label: string) => void;
}
