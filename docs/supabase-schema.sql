-- Supabase schema for Hirelens
-- Run via Supabase SQL editor or `supabase db push` with appropriate project

-- Organizations
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Users (application-level metadata)
CREATE TABLE IF NOT EXISTS app_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  organization_id uuid REFERENCES organizations(id),
  role text DEFAULT 'member',
  created_at timestamptz DEFAULT now()
);

-- Organization membership (explicit)
CREATE TABLE IF NOT EXISTS organization_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES app_users(id) ON DELETE CASCADE,
  role text DEFAULT 'member',
  created_at timestamptz DEFAULT now(),
  UNIQUE (organization_id, user_id)
);

-- Jobs
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  location text,
  employment_type text,
  experience_level text,
  min_salary integer,
  max_salary integer,
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Job requirements / qualifications
CREATE TABLE IF NOT EXISTS job_requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  requirement_type text,
  text text
);

-- Skills (canonical)
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL
);

-- Applicants
CREATE TABLE IF NOT EXISTS applicants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  full_name text,
  email text,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Resumes metadata
CREATE TABLE IF NOT EXISTS resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id uuid REFERENCES applicants(id) ON DELETE CASCADE,
  file_name text,
  file_size bigint,
  file_path text,
  parsed jsonb,
  created_at timestamptz DEFAULT now()
);

-- Applicant skills (normalized)
CREATE TABLE IF NOT EXISTS applicant_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id uuid REFERENCES applicants(id) ON DELETE CASCADE,
  skill_id uuid REFERENCES skills(id),
  proficiency numeric,
  source text
);

-- AI processing jobs (background)
CREATE TABLE IF NOT EXISTS ai_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  status text DEFAULT 'pending',
  payload jsonb,
  result jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Basic indexes
CREATE INDEX IF NOT EXISTS idx_jobs_org ON jobs (organization_id);
CREATE INDEX IF NOT EXISTS idx_applicants_org ON applicants (organization_id);
CREATE INDEX IF NOT EXISTS idx_resumes_applicant ON resumes (applicant_id);

-- Row-Level Security examples
-- Enable RLS on tables that should be organization-scoped
ALTER TABLE IF EXISTS jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS applicants ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS resumes ENABLE ROW LEVEL SECURITY;

-- Example policy: allow authenticated users to select rows where they belong to the organization
-- This policy assumes you store organization_id in `app_users` and that `auth.uid()` returns the auth user id

-- Policy helper (Postgres function) - optional
-- CREATE OR REPLACE FUNCTION current_app_user_organization() RETURNS uuid AS $$
--   SELECT organization_id FROM app_users WHERE auth_id = auth.uid() LIMIT 1;
-- $$ LANGUAGE sql STABLE;

-- Example SELECT policy for jobs
CREATE POLICY select_jobs_for_org ON jobs
  FOR SELECT
  USING (
    organization_id = (
      SELECT organization_id FROM app_users WHERE auth_id = auth.uid() LIMIT 1
    )
  );

-- Example INSERT policy for jobs (only members of the organization can insert)
CREATE POLICY insert_jobs_for_org ON jobs
  FOR INSERT
  WITH CHECK (
    organization_id = (
      SELECT organization_id FROM app_users WHERE auth_id = auth.uid() LIMIT 1
    )
  );

-- Example UPDATE/DELETE policies (only allow updates/deletes within organization)
CREATE POLICY modify_jobs_for_org ON jobs
  FOR UPDATE, DELETE
  USING (
    organization_id = (
      SELECT organization_id FROM app_users WHERE auth_id = auth.uid() LIMIT 1
    )
  );

-- Note: Adjust policies to your security model. Enable/disable RLS per table as needed.

-- End of schema
