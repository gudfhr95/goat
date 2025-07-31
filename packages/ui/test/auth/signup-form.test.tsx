import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SignupForm } from "../../src/auth/signup-form";

describe("SignupForm", () => {
  const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {
    // Suppress console errors in tests
  });

  beforeEach(() => {
    consoleErrorSpy.mockClear();
  });
  it("renders signup form with all elements", () => {
    render(<SignupForm />);

    expect(screen.getByText("Create an account")).toBeInTheDocument();
    expect(
      screen.getByText("Enter your email below to create your account"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign up" })).toBeInTheDocument();
    expect(screen.getByText("Or continue with")).toBeInTheDocument();
    expect(screen.getByText("Terms of Service")).toBeInTheDocument();
    expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
  });

  it("displays validation errors for empty fields", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    const submitButton = screen.getByRole("button", { name: "Sign up" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Please enter a valid email address"),
      ).toBeInTheDocument();
    });
  });

  it("validates password length", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "short");

    const submitButton = screen.getByRole("button", { name: "Sign up" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Password must be at least 8 characters"),
      ).toBeInTheDocument();
    });
  });

  it("validates password confirmation match", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.type(confirmPasswordInput, "password456");

    const submitButton = screen.getByRole("button", { name: "Sign up" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Passwords don't match")).toBeInTheDocument();
    });
  });

  it("calls onSubmit with email and password when form is valid", async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn();
    render(<SignupForm onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.type(confirmPasswordInput, "password123");

    const submitButton = screen.getByRole("button", { name: "Sign up" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("shows loading state during submission", async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn(
      () => new Promise<void>((resolve) => setTimeout(resolve, 100)),
    );
    render(<SignupForm onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.type(confirmPasswordInput, "password123");

    const submitButton = screen.getByRole("button", { name: "Sign up" });
    await user.click(submitButton);

    expect(
      screen.getByRole("button", { name: "Creating account..." }),
    ).toBeDisabled();
  });

  it("displays error message when signup fails", async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn().mockRejectedValue(new Error("Signup failed"));
    render(<SignupForm onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.type(confirmPasswordInput, "password123");

    const submitButton = screen.getByRole("button", { name: "Sign up" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to create account. Please try again."),
      ).toBeInTheDocument();
    });
  });

  it("renders sign in link when onSignInClick is provided", () => {
    const mockOnSignInClick = vi.fn();
    render(<SignupForm onSignInClick={mockOnSignInClick} />);

    expect(screen.getByText("Already have an account?")).toBeInTheDocument();
    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });

  it("calls onSignInClick when sign in link is clicked", async () => {
    const user = userEvent.setup();
    const mockOnSignInClick = vi.fn();
    render(<SignupForm onSignInClick={mockOnSignInClick} />);

    const signInLink = screen.getByText("Sign in");
    await user.click(signInLink);

    expect(mockOnSignInClick).toHaveBeenCalled();
  });

  it("renders Google sign up button when onGoogleSignIn is provided", () => {
    const mockOnGoogleSignIn = vi.fn();
    render(<SignupForm onGoogleSignIn={mockOnGoogleSignIn} />);

    expect(screen.getByRole("button", { name: /Google/ })).toBeInTheDocument();
  });

  it("calls onGoogleSignIn when Google button is clicked", async () => {
    const user = userEvent.setup();
    const mockOnGoogleSignIn = vi.fn();
    render(<SignupForm onGoogleSignIn={mockOnGoogleSignIn} />);

    const googleButton = screen.getByRole("button", { name: /Google/ });
    await user.click(googleButton);

    expect(mockOnGoogleSignIn).toHaveBeenCalled();
  });

  it("renders Facebook sign up button when onFacebookSignIn is provided", () => {
    const mockOnFacebookSignIn = vi.fn();
    render(<SignupForm onFacebookSignIn={mockOnFacebookSignIn} />);

    expect(
      screen.getByRole("button", { name: /Facebook/ }),
    ).toBeInTheDocument();
  });

  it("calls onFacebookSignIn when Facebook button is clicked", async () => {
    const user = userEvent.setup();
    const mockOnFacebookSignIn = vi.fn();
    render(<SignupForm onFacebookSignIn={mockOnFacebookSignIn} />);

    const facebookButton = screen.getByRole("button", { name: /Facebook/ });
    await user.click(facebookButton);

    expect(mockOnFacebookSignIn).toHaveBeenCalled();
  });

  it("disables form during OAuth sign up", async () => {
    const user = userEvent.setup();
    const mockOnGoogleSignIn = vi.fn(
      () => new Promise<void>((resolve) => setTimeout(resolve, 100)),
    );
    render(<SignupForm onGoogleSignIn={mockOnGoogleSignIn} />);

    const googleButton = screen.getByRole("button", { name: /Google/ });
    await user.click(googleButton);

    expect(screen.getByRole("button", { name: "Sign up" })).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Loading..." }),
    ).toBeInTheDocument();
  });

  it("displays error message when OAuth sign up fails", async () => {
    const user = userEvent.setup();
    const mockOnGoogleSignIn = vi
      .fn()
      .mockRejectedValue(new Error("OAuth failed"));
    render(<SignupForm onGoogleSignIn={mockOnGoogleSignIn} />);

    const googleButton = screen.getByRole("button", { name: /Google/ });
    await user.click(googleButton);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to sign up with google. Please try again."),
      ).toBeInTheDocument();
    });
  });

  it("renders links to terms and privacy policy", () => {
    render(<SignupForm />);

    const termsLink = screen.getByRole("link", { name: "Terms of Service" });
    const privacyLink = screen.getByRole("link", { name: "Privacy Policy" });

    expect(termsLink).toHaveAttribute("href", "/terms");
    expect(privacyLink).toHaveAttribute("href", "/privacy");
  });
});
