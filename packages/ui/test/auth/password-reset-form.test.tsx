import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PasswordResetForm } from "../../src/auth/password-reset-form";

describe("PasswordResetForm", () => {
  const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {
    // Suppress console errors in tests
  });

  beforeEach(() => {
    consoleErrorSpy.mockClear();
  });
  it("renders password reset form with all elements", () => {
    render(<PasswordResetForm />);

    expect(screen.getByText("Forgot your password?")).toBeInTheDocument();
    expect(
      screen.getByText("No worries, we'll send you reset instructions."),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Send reset email" }),
    ).toBeInTheDocument();
  });

  it("displays validation error for invalid email", async () => {
    const user = userEvent.setup();
    render(<PasswordResetForm />);

    const submitButton = screen.getByRole("button", {
      name: "Send reset email",
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Please enter a valid email address"),
      ).toBeInTheDocument();
    });
  });

  it("calls onSubmit with email when form is valid", async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn();
    render(<PasswordResetForm onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByLabelText("Email");
    await user.type(emailInput, "test@example.com");

    const submitButton = screen.getByRole("button", {
      name: "Send reset email",
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: "test@example.com",
      });
    });
  });

  it("shows loading state during submission", async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn(
      () => new Promise<void>((resolve) => setTimeout(resolve, 100)),
    );
    render(<PasswordResetForm onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByLabelText("Email");
    await user.type(emailInput, "test@example.com");

    const submitButton = screen.getByRole("button", {
      name: "Send reset email",
    });
    await user.click(submitButton);

    expect(screen.getByRole("button", { name: "Sending..." })).toBeDisabled();
  });

  it("displays success message after successful submission", async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
    render(<PasswordResetForm onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByLabelText("Email");
    await user.type(emailInput, "test@example.com");

    const submitButton = screen.getByRole("button", {
      name: "Send reset email",
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Check your email")).toBeInTheDocument();
      expect(
        screen.getByText(
          "We've sent a password reset link to your email address.",
        ),
      ).toBeInTheDocument();
    });
  });

  it("displays error message when password reset fails", async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn().mockRejectedValue(new Error("Reset failed"));
    render(<PasswordResetForm onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByLabelText("Email");
    await user.type(emailInput, "test@example.com");

    const submitButton = screen.getByRole("button", {
      name: "Send reset email",
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to send reset email. Please try again."),
      ).toBeInTheDocument();
    });
  });

  it("renders back to sign in link when onBackToSignIn is provided", () => {
    const mockOnBackToSignIn = vi.fn();
    render(<PasswordResetForm onBackToSignIn={mockOnBackToSignIn} />);

    expect(screen.getByText("← Back to sign in")).toBeInTheDocument();
  });

  it("calls onBackToSignIn when back link is clicked", async () => {
    const user = userEvent.setup();
    const mockOnBackToSignIn = vi.fn();
    render(<PasswordResetForm onBackToSignIn={mockOnBackToSignIn} />);

    const backLink = screen.getByText("← Back to sign in");
    await user.click(backLink);

    expect(mockOnBackToSignIn).toHaveBeenCalled();
  });

  it("shows back to sign in button in success state", async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
    const mockOnBackToSignIn = vi.fn();
    render(
      <PasswordResetForm
        onSubmit={mockOnSubmit}
        onBackToSignIn={mockOnBackToSignIn}
      />,
    );

    const emailInput = screen.getByLabelText("Email");
    await user.type(emailInput, "test@example.com");

    const submitButton = screen.getByRole("button", {
      name: "Send reset email",
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Check your email")).toBeInTheDocument();
    });

    expect(
      screen.getByRole("button", { name: "Back to sign in" }),
    ).toBeInTheDocument();
  });

  it("calls onBackToSignIn from success state", async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
    const mockOnBackToSignIn = vi.fn();
    render(
      <PasswordResetForm
        onSubmit={mockOnSubmit}
        onBackToSignIn={mockOnBackToSignIn}
      />,
    );

    const emailInput = screen.getByLabelText("Email");
    await user.type(emailInput, "test@example.com");

    const submitButton = screen.getByRole("button", {
      name: "Send reset email",
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Check your email")).toBeInTheDocument();
    });

    const backButton = screen.getByRole("button", { name: "Back to sign in" });
    await user.click(backButton);

    expect(mockOnBackToSignIn).toHaveBeenCalled();
  });

  it("allows user to try again from success state", async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
    render(<PasswordResetForm onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByLabelText("Email");
    await user.type(emailInput, "test@example.com");

    const submitButton = screen.getByRole("button", {
      name: "Send reset email",
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Check your email")).toBeInTheDocument();
    });

    const tryAgainLink = screen.getByText("try again");
    await user.click(tryAgainLink);

    expect(screen.getByText("Forgot your password?")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toHaveValue("");
  });

  it("resets form when trying again", async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
    render(<PasswordResetForm onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByLabelText("Email");
    await user.type(emailInput, "test@example.com");

    const submitButton = screen.getByRole("button", {
      name: "Send reset email",
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Check your email")).toBeInTheDocument();
    });

    const tryAgainLink = screen.getByText("try again");
    await user.click(tryAgainLink);

    const newEmailInput = screen.getByLabelText("Email");
    expect(newEmailInput).toHaveValue("");

    await user.type(newEmailInput, "new@example.com");
    await user.click(screen.getByRole("button", { name: "Send reset email" }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenLastCalledWith({
        email: "new@example.com",
      });
    });
  });
});
