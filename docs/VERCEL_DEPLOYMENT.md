# Vercel Deployment Guide

## Overview

This guide covers deploying Hirelens to Vercel at `https://hirelens.vercel.app`.

## Prerequisites

- Vercel account (free tier available at https://vercel.com)
- GitHub account with this repository pushed
- Supabase project configured
- Google OAuth credentials created (see GOOGLE_OAUTH_SETUP.md)

## Step 1: Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New...** > **Project**
3. Import your GitHub repository (hirelens)
4. Select **Import Git Repository**
5. Vercel will auto-detect Next.js settings
6. Click **Deploy**

## Step 2: Configure Environment Variables

After the initial deployment fails (expected), configure environment variables:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** > **Environment Variables**
3. Add the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_APP_URL=https://hirelens.vercel.app

# Application
NODE_ENV=production
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_GOOGLE_OAUTH=true
```

## Step 3: Update Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select project `hirelens007`
3. Navigate to **APIs & Services** > **Credentials**
4. Edit the OAuth 2.0 Client (Web application)
5. Add to **Authorized redirect URIs**:
   ```
   https://hirelens.vercel.app/auth/callback
   ```
6. Save

## Step 4: Redeploy

1. In Vercel dashboard, click **Deployments**
2. Click the three dots on the latest deployment
3. Select **Redeploy**
4. Wait for build to complete

## Step 5: Test Deployment

1. Visit `https://hirelens.vercel.app`
2. Test Google OAuth sign-in
3. Verify the `/auth/callback` route works
4. Check console for any errors

## Troubleshooting

### Build Fails

- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify TypeScript compilation locally: `pnpm build`

### OAuth Fails

- Verify Client ID in `.env.local.example` matches Vercel env vars
- Check Google Console redirect URI: `https://hirelens.vercel.app/auth/callback`
- Verify Supabase Google provider is enabled
- Check browser console for detailed error

### Deployment Issues

- Clear Vercel cache: click **...** on deployment > **Redeploy with Cache Cleared**
- Check Vercel build logs for specific errors
- Ensure `.gitignore` doesn't exclude necessary files

## Continuous Deployment

After initial setup, Vercel will automatically deploy on every push to `main` branch:

```bash
git push origin main
```

Monitor deployment status in Vercel dashboard.

## Performance Monitoring

1. Go to **Analytics** in Vercel dashboard
2. Monitor:
   - Web Vitals (Core Web Vitals)
   - Edge Function performance
   - Error rates

## Database & Backups

- Supabase handles all database operations
- Ensure RLS policies are properly configured
- Set up Supabase backups (see Supabase docs)
- Monitor Supabase usage in dashboard

## Scaling & Limits

**Free Tier Limits (Vercel)**:

- 100 GB bandwidth/month
- Serverless functions with 10s timeout
- 12 function executions/second

**Production Considerations**:

- Upgrade to Pro if exceeding limits
- Monitor database load in Supabase
- Set up caching for frequently accessed data
- Consider CDN for static assets

## Next Steps

1. Set up monitoring & alerting
2. Configure custom domain (optional)
3. Set up CI/CD status checks
4. Plan for database optimization
5. Monitor production analytics

## Rollback

To rollback to previous version:

1. In Vercel dashboard, go to **Deployments**
2. Click **...** on a previous successful deployment
3. Click **Promote to Production**

## Support

For Vercel-specific issues: https://vercel.com/docs
For Next.js issues: https://nextjs.org/docs
