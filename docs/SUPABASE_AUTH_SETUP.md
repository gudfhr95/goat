# Supabase Authentication Setup Guide

This guide will help you configure Supabase Authentication for this project.

## Prerequisites

- A Supabase project (create one at https://supabase.com)
- Google Cloud Console access (for Google OAuth)
- Facebook Developer account (for Facebook OAuth)

## Step 1: Get Supabase Credentials

1. Go to your Supabase dashboard
2. Navigate to Settings → API
3. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon/Public Key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 2: Configure Google OAuth (Optional)

If you want to enable Google sign-in:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth Client ID
5. Configure OAuth consent screen if prompted
6. Set application type to "Web application"
7. Add authorized redirect URIs:
   - `https://[YOUR_PROJECT_REF].supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for local development)
8. Copy the Client ID and Client Secret

## Step 3: Configure Facebook OAuth (Optional)

If you want to enable Facebook sign-in:

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or select existing one
3. Add Facebook Login product
4. Go to Facebook Login → Settings
5. Add OAuth redirect URIs:
   - `https://[YOUR_PROJECT_REF].supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for local development)
6. Copy the App ID and App Secret from Settings → Basic

## Step 4: Configure Supabase Dashboard

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Email provider (for email/password auth)
3. If using Google OAuth:
   - Enable Google provider
   - Add the Client ID and Client Secret from Step 2
4. If using Facebook OAuth:
   - Enable Facebook provider
   - Add the App ID and App Secret from Step 3

## Step 5: Set Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```bash
# Supabase configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

## Notes

- The `NEXT_PUBLIC_` prefix is required for environment variables that need to be accessible in the browser
- OAuth credentials are configured directly in Supabase Dashboard, not in your `.env` file
- Make sure to never commit your `.env` file to version control
- For production, set these environment variables in your hosting platform (Vercel, etc.)

## References

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth Setup Guide](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Facebook OAuth Setup Guide](https://supabase.com/docs/guides/auth/social-login/auth-facebook)