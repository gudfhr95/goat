"use client";

import * as React from "react";

import { ThemeProvider, ThemeToggle } from "@goat/ui/theme";
import { Toaster } from "@goat/ui/toast";

import { TRPCReactProvider } from "~/trpc/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <TRPCReactProvider>{children}</TRPCReactProvider>
      <div className="absolute right-4 bottom-4">
        <ThemeToggle />
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
