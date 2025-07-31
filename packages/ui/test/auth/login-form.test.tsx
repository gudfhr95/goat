import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LoginForm } from "../../src/auth/login-form";

describe("LoginForm", () => {
  const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {
    // Suppress console errors in tests
  });

  beforeEach(() => {
    consoleErrorSpy.mockClear();
  });
  it("renders login form with all elements", () => {
    render(<LoginForm />);

    expect(screen.getByText("Welcome back")).toBeInTheDocument();
    expect(
      screen.getByText("Enter your email to sign in to your account"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
    expect(screen.getByText("Or continue with")).toBeInTheDocument();
  });

  it("displays validation errors for invalid inputs", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const submitButton = screen.getByRole("button", { name: "Sign in" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Please enter a valid email address"),
      ).toBeInTheDocument();
    });
  });

  it("validates password length", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "short");

    const submitButton = screen.getByRole("button", { name: "Sign in" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Password must be at least 8 characters"),
      ).toBeInTheDocument();
    });
  });

  it("calls onSubmit with form values when form is valid", async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn();
    render(<LoginForm onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");

    const submitButton = screen.getByRole("button", { name: "Sign in" });
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
    render(<LoginForm onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");

    const submitButton = screen.getByRole("button", { name: "Sign in" });
    await user.click(submitButton);

    expect(
      screen.getByRole("button", { name: "Signing in..." }),
    ).toBeDisabled();
  });

  it("displays error message when login fails", async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn().mockRejectedValue(new Error("Login failed"));
    render(<LoginForm onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");

    const submitButton = screen.getByRole("button", { name: "Sign in" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Invalid email or password. Please try again."),
      ).toBeInTheDocument();
    });
  });

  it("renders forgot password link when onForgotPassword is provided", () => {
    const mockOnForgotPassword = vi.fn();
    render(<LoginForm onForgotPassword={mockOnForgotPassword} />);

    expect(screen.getByText("Forgot password?")).toBeInTheDocument();
  });

  it("calls onForgotPassword when forgot password link is clicked", async () => {
    const user = userEvent.setup();
    const mockOnForgotPassword = vi.fn();
    render(<LoginForm onForgotPassword={mockOnForgotPassword} />);

    const forgotPasswordLink = screen.getByText("Forgot password?");
    await user.click(forgotPasswordLink);

    expect(mockOnForgotPassword).toHaveBeenCalled();
  });

  it("renders sign up link when onSignUpClick is provided", () => {
    const mockOnSignUpClick = vi.fn();
    render(<LoginForm onSignUpClick={mockOnSignUpClick} />);

    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByText("Sign up")).toBeInTheDocument();
  });

  it("calls onSignUpClick when sign up link is clicked", async () => {
    const user = userEvent.setup();
    const mockOnSignUpClick = vi.fn();
    render(<LoginForm onSignUpClick={mockOnSignUpClick} />);

    const signUpLink = screen.getByText("Sign up");
    await user.click(signUpLink);

    expect(mockOnSignUpClick).toHaveBeenCalled();
  });

  it("renders Google sign in button when onGoogleSignIn is provided", () => {
    const mockOnGoogleSignIn = vi.fn();
    render(<LoginForm onGoogleSignIn={mockOnGoogleSignIn} />);

    expect(screen.getByRole("button", { name: /Google/ })).toBeInTheDocument();
  });

  it("calls onGoogleSignIn when Google button is clicked", async () => {
    const user = userEvent.setup();
    const mockOnGoogleSignIn = vi.fn();
    render(<LoginForm onGoogleSignIn={mockOnGoogleSignIn} />);

    const googleButton = screen.getByRole("button", { name: /Google/ });
    await user.click(googleButton);

    expect(mockOnGoogleSignIn).toHaveBeenCalled();
  });

  it("renders Facebook sign in button when onFacebookSignIn is provided", () => {
    const mockOnFacebookSignIn = vi.fn();
    render(<LoginForm onFacebookSignIn={mockOnFacebookSignIn} />);

    expect(
      screen.getByRole("button", { name: /Facebook/ }),
    ).toBeInTheDocument();
  });

  it("calls onFacebookSignIn when Facebook button is clicked", async () => {
    const user = userEvent.setup();
    const mockOnFacebookSignIn = vi.fn();
    render(<LoginForm onFacebookSignIn={mockOnFacebookSignIn} />);

    const facebookButton = screen.getByRole("button", { name: /Facebook/ });
    await user.click(facebookButton);

    expect(mockOnFacebookSignIn).toHaveBeenCalled();
  });

  it("disables form during OAuth sign in", async () => {
    const user = userEvent.setup();
    const mockOnGoogleSignIn = vi.fn(
      () => new Promise<void>((resolve) => setTimeout(resolve, 100)),
    );
    render(<LoginForm onGoogleSignIn={mockOnGoogleSignIn} />);

    const googleButton = screen.getByRole("button", { name: /Google/ });
    await user.click(googleButton);

    expect(screen.getByRole("button", { name: "Sign in" })).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Loading..." }),
    ).toBeInTheDocument();
  });

  it("displays error message when OAuth sign in fails", async () => {
    const user = userEvent.setup();
    const mockOnGoogleSignIn = vi
      .fn()
      .mockRejectedValue(new Error("OAuth failed"));
    render(<LoginForm onGoogleSignIn={mockOnGoogleSignIn} />);

    const googleButton = screen.getByRole("button", { name: /Google/ });
    await user.click(googleButton);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to sign in with google. Please try again."),
      ).toBeInTheDocument();
    });
  });
});
