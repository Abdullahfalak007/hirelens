# Supabase Database Setup Guide

## Prerequisites

- Supabase project created at https://supabase.com
- Project URL and anon key (public) obtained from Supabase dashboard

## Steps

### 1. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Update with your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Create Tables and Schema

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query and paste the contents of `docs/supabase-schema.sql`
4. Click **Run** to execute

This will create:

- `organizations` - company/org records
- `app_users` - application user metadata (linked to auth.users)
- `organization_members` - membership mapping
- `jobs` - job postings
- `job_requirements` - job skills/requirements
- `skills` - canonical skill names
- `applicants` - applicant profiles
- `resumes` - resume uploads & parsed data
- `applicant_skills` - applicant skills (normalized)
- `ai_jobs` - background AI processing queue

### 3. Enable Row-Level Security (RLS)

The schema includes basic RLS policies. You can:

- Adjust policies to match your security model
- Test with test users before going to production

### 4. Test the Setup

Once environment variables are set, restart the dev server:

```bash
pnpm dev
```

Then test the `/api/jobs` endpoint:

```bash
curl -H "Authorization: Bearer <your-jwt-token>" http://localhost:3000/api/jobs
```

(You'll need to authenticate first to get a JWT token.)

## Troubleshooting

**"Missing environment variables"**: Ensure `.env.local` exists and has correct values.

**"Unauthorized" from API**: Make sure you're authenticated and the user has an `app_users` record with an `organization_id`.

**Schema conflicts**: If tables already exist, the `CREATE TABLE IF NOT EXISTS` will skip them. To reset, run `DROP TABLE IF EXISTS <table_name>;` for each table (be careful—this deletes data!).

## Next Steps

- Create a sign-up flow that creates organizations and user records
- Implement job posting pages
- Add resume upload functionality
