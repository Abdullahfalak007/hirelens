# Hirelens Deployment Quick Start

## Live URL

🚀 **https://hirelens.vercel.app**

## Deployment Steps Summary

### 1️⃣ Google Cloud Console

```
Project ID: hirelens007
Add Redirect URI: https://hirelens.vercel.app/auth/callback
Copy: Client ID & Client Secret
```

### 2️⃣ Supabase Project

- Enable Google OAuth provider
- Paste Client ID and Client Secret
- Note: Supabase project URL & anon key

### 3️⃣ Vercel Dashboard

```
Repository: hirelens (GitHub)
Project: hirelens

Environment Variables:
├── NEXT_PUBLIC_SUPABASE_URL
├── NEXT_PUBLIC_SUPABASE_ANON_KEY
├── SUPABASE_SERVICE_ROLE_KEY
├── NEXT_PUBLIC_GOOGLE_CLIENT_ID
├── NEXT_PUBLIC_APP_URL=https://hirelens.vercel.app
├── NODE_ENV=production
└── NEXT_PUBLIC_ENABLE_GOOGLE_OAUTH=true
```

### 4️⃣ Deploy

```bash
git push origin main
# Vercel auto-deploys!
```

## Verify Deployment

1. Visit https://hirelens.vercel.app
2. Click "Sign in with Google"
3. Confirm redirect to callback page works
4. Check browser console for errors

## Troubleshooting Links

- **Build fails?** → Check Vercel build logs
- **OAuth fails?** → Verify redirect URIs in Google & Supabase
- **Need help?** → See full docs:
  - `docs/GOOGLE_OAUTH_SETUP.md`
  - `docs/VERCEL_DEPLOYMENT.md`
  - `docs/SUPABASE_SETUP.md`

## Environment Variable Template

Create `.env.local` for local development:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google OAuth (get from Google Cloud Console)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_GOOGLE_OAUTH=true
```

For Vercel production, add same vars (minus service role) in Vercel dashboard Settings > Environment Variables.

## Quick Commands

```bash
# Local development
pnpm install
pnpm dev

# Build locally
pnpm build

# Deploy to Vercel
git push origin main
```

## Status

- ✅ Next.js 15+ (App Router)
- ✅ TypeScript (strict mode)
- ✅ Supabase (PostgreSQL + Auth)
- ✅ Google OAuth
- ✅ Tailwind CSS + Radix UI
- ✅ Ready for production

---

Last Updated: February 4, 2026
