# Google OAuth Setup Guide

## Prerequisites

- Google Cloud Project created: `hirelens` (Project ID: `hirelens007`)
- Supabase project set up with credentials

## Step 1: Create OAuth 2.0 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Make sure you're in project `hirelens007`
3. Navigate to **APIs & Services** > **Credentials**
4. Click **+ Create Credentials** > **OAuth client ID**
5. If prompted to create OAuth consent screen first:
   - Click **Create OAuth consent screen**
   - Select **External** user type
   - Fill in required fields:
     - App name: `Hirelens`
     - User support email: Your email
     - Developer contact: Your email
   - On Scopes, add:
     - `email`
     - `profile`
     - `openid`
   - Review and create
6. After consent screen is created, go back to **Credentials**
7. Click **+ Create Credentials** > **OAuth client ID**
8. Select **Web application**
9. Name it: `Hirelens Web Client`
10. Add Authorized redirect URIs:
    ```
    http://localhost:3000/auth/callback
    https://yourdomain.com/auth/callback
    ```
    (Replace `yourdomain.com` with your actual domain when deploying)
11. Click **Create**
12. Copy the **Client ID** and **Client Secret**

## Step 2: Configure Supabase for Google OAuth

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Providers**
3. Click on **Google**
4. Enable the provider
5. Paste your Google **Client ID** and **Client Secret**
6. Add redirect URL: `https://your-supabase-project.supabase.co/auth/v1/callback`
7. Save

## Step 3: Update Environment Variables

Copy the credentials to `.env.local`:

```env
# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<your-client-id-from-step-1>
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=<your-client-secret-from-step-1>
```

## Step 4: Update Your Application

The authentication hooks will automatically support Google OAuth via Supabase. Users can sign in with:

```typescript
const { signInWithGoogle } = useAuth();
await signInWithGoogle();
```

## Testing Locally

1. Start dev server:

   ```bash
   pnpm dev
   ```

2. Visit `http://localhost:3000`
3. Click "Sign in with Google"
4. You'll be redirected to Google login, then back to the app

## Deployment Checklist

- [ ] Add production redirect URI to Google Console credentials
- [ ] Update `.env.local` with production Supabase URL
- [ ] Enable Google provider in production Supabase project
- [ ] Test sign-in flow in production environment
- [ ] Set up email confirmation (optional, via Supabase settings)

## Troubleshooting

**"Redirect URI mismatch"**

- Ensure the exact redirect URL is added to Google Console Authorized redirect URIs
- Check for trailing slashes and http vs https

**"Sign in fails silently"**

- Check browser console for errors
- Verify Client ID is correct in .env.local
- Verify Google provider is enabled in Supabase

**"User created but profile incomplete"**

- Google may not provide all profile data
- Supabase auth.users will have email; your app_users table needs explicit insert

## Next Steps

Once Google OAuth is working:

1. Create a complete signup flow that creates organizations
2. Add user profile completion page
3. Set up email verification (optional)
