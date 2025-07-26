# Requirements Document - User Registration with Supabase Authentication

## Introduction

This feature implements a comprehensive user registration system by migrating from the current Better Auth implementation to Supabase Authentication. The registration system will support email/password authentication, integrate seamlessly with both web (Next.js) and mobile (Expo) applications, and maintain the existing shadcn design language. This migration will provide a more scalable authentication solution while adding essential registration capabilities that are currently missing.

## Codebase Analysis Summary

**Existing Code to Leverage:**
- UI Components: Button, Form, Input, Label, Toast from @goat/ui (shadcn)
- Server action patterns in AuthShowcase component
- tRPC API structure and protected procedures
- Mobile secure storage implementation (session-store.ts)
- Environment variable management with @t3-oss/env
- Monorepo package structure

**Components to Replace:**
- Better Auth package (@better-auth/core)
- Auth schema in @goat/db
- Server/client auth initialization
- Session management logic

## Requirements

### Requirement 1: Backend Supabase Integration

**User Story:** As a developer, I want to integrate Supabase Authentication, so that the application uses a scalable and feature-rich auth service

#### Acceptance Criteria

1. WHEN the application starts THEN the system SHALL initialize Supabase client with proper configuration
2. WHEN Better Auth dependencies are present THEN the system SHALL remove all Better Auth packages and related code
3. IF existing users are in the database THEN the system SHALL provide a migration path to Supabase auth.users table
4. WHEN auth operations are performed THEN the system SHALL use Supabase SDK methods instead of Better Auth
5. IF environment variables are missing THEN the system SHALL provide clear error messages about required Supabase configuration

### Requirement 2: User Registration API

**User Story:** As a new user, I want to register with email and password, so that I can create an account and access the application

#### Acceptance Criteria

1. WHEN a user submits valid registration data THEN the system SHALL create a new user account in Supabase
2. IF the email already exists THEN the system SHALL return an appropriate error message
3. WHEN registration is successful THEN the system SHALL send a verification email to the user
4. IF the password is weak THEN the system SHALL reject the registration with specific requirements
5. WHEN network errors occur THEN the system SHALL handle them gracefully with retry options
6. IF registration attempts exceed rate limits THEN the system SHALL implement appropriate throttling

### Requirement 3: Frontend Registration Form

**User Story:** As a web user, I want a user-friendly registration form, so that I can easily create an account

#### Acceptance Criteria

1. WHEN the registration page loads THEN the system SHALL display a form with email, password, and confirm password fields
2. IF a user enters invalid email format THEN the system SHALL show real-time validation error
3. WHEN password is typed THEN the system SHALL display a strength indicator
4. IF passwords don't match THEN the system SHALL prevent form submission
5. WHEN form is submitted THEN the system SHALL show loading state and disable inputs
6. IF registration succeeds THEN the system SHALL redirect to email verification page
7. WHEN errors occur THEN the system SHALL display them using Toast notifications

### Requirement 4: Mobile Registration Implementation

**User Story:** As a mobile user, I want to register through the mobile app, so that I can create an account on my device

#### Acceptance Criteria

1. WHEN the registration screen opens THEN the system SHALL display native-feeling form inputs
2. IF keyboard opens THEN the system SHALL adjust scroll view to keep inputs visible
3. WHEN biometric authentication is available THEN the system SHALL offer to enable it after registration
4. IF deep link for email verification is clicked THEN the system SHALL handle it within the app
5. WHEN registration succeeds THEN the system SHALL securely store auth tokens using Expo SecureStore
6. IF app is backgrounded during registration THEN the system SHALL maintain form state

### Requirement 5: Email Verification

**User Story:** As a registered user, I want to verify my email address, so that I can confirm ownership and access full features

#### Acceptance Criteria

1. WHEN registration completes THEN the system SHALL send verification email within 1 minute
2. IF verification link is clicked THEN the system SHALL mark email as verified in Supabase
3. WHEN verification link expires THEN the system SHALL show appropriate error with resend option
4. IF user requests resend THEN the system SHALL send new verification email with fresh token
5. WHEN email is verified THEN the system SHALL automatically log in the user
6. IF user tries to login without verification THEN the system SHALL prompt to verify email first

### Requirement 6: Session Management

**User Story:** As an authenticated user, I want my session to persist appropriately, so that I don't need to login repeatedly

#### Acceptance Criteria

1. WHEN user successfully registers THEN the system SHALL create a new session
2. IF user closes and reopens web browser THEN the system SHALL restore session from cookies
3. WHEN mobile app is reopened THEN the system SHALL restore session from secure storage
4. IF session expires THEN the system SHALL prompt for re-authentication
5. WHEN user logs out THEN the system SHALL clear all session data and tokens
6. IF multiple devices are used THEN the system SHALL support concurrent sessions

## Non-Functional Requirements

### Performance
- Registration API response time SHALL be under 2 seconds
- Form validation SHALL provide instant feedback (< 100ms)
- Email delivery SHALL occur within 60 seconds of registration
- Mobile app SHALL cache registration form state to handle interruptions

### Security
- Passwords SHALL require minimum 8 characters with complexity requirements
- All auth tokens SHALL be stored in secure storage (httpOnly cookies on web, SecureStore on mobile)
- Registration endpoint SHALL implement rate limiting (max 5 attempts per IP per hour)
- Email verification tokens SHALL expire after 24 hours
- System SHALL implement CAPTCHA for repeated failed attempts
- All auth-related communications SHALL use HTTPS/TLS

### Reliability
- System SHALL handle Supabase service outages gracefully
- Registration process SHALL be atomic (all-or-nothing)
- Email delivery SHALL retry up to 3 times on failure
- Mobile app SHALL queue registration attempts when offline

### Usability
- Registration form SHALL follow shadcn design patterns
- Error messages SHALL be clear and actionable
- Password requirements SHALL be displayed upfront
- Form SHALL be fully accessible with ARIA labels
- Mobile experience SHALL feel native to the platform
- Loading states SHALL provide clear feedback
