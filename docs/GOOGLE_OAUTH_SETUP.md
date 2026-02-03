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
    https://hirelens.vercel.app/auth/callback
    ```
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

1. Make sure `NEXT_PUBLIC_APP_URL=http://localhost:3000` in `.env.local`
2. Start dev server:
   ```bash
   pnpm dev
   ```
3. Visit `http://localhost:3000`
4. Click "Sign in with Google"
5. You'll be redirected to Google login, then back to `http://localhost:3000/auth/callback`

## Testing on Vercel

1. Ensure `NEXT_PUBLIC_APP_URL=https://hirelens.vercel.app` is set in Vercel environment variables
2. Deploy to Vercel:
   ```bash
   git push origin main
   ```
3. Visit `https://hirelens.vercel.app`
4. Click "Sign in with Google"
5. You'll be redirected to Google login, then back to `https://hirelens.vercel.app/auth/callback`

## Deployment Checklist

### Google Cloud Console

- [ ] Add `https://hirelens.vercel.app/auth/callback` to Authorized redirect URIs
- [ ] Verify Client ID and Client Secret are correct

### Supabase

- [ ] Enable Google provider in production Supabase project
- [ ] Paste Client ID and Client Secret into Supabase Google settings
- [ ] Verify Supabase redirect URL: `https://your-supabase-project.supabase.co/auth/v1/callback`

### Vercel Environment

- [ ] Set production environment variables in Vercel dashboard:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
  - `NEXT_PUBLIC_APP_URL=https://hirelens.vercel.app`
  - `SUPABASE_SERVICE_ROLE_KEY` (for server functions)
- [ ] Deploy to production
- [ ] Test sign-in flow at `https://hirelens.vercel.app`
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
