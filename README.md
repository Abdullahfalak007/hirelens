This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

## Hirelens - AI-Powered Resume Ranking Platform

An enterprise-grade, full-stack application for intelligent resume analysis and applicant ranking powered by AI.

## 🎯 Overview

Hirelens helps recruiters and hiring teams efficiently evaluate and rank job applicants by leveraging AI-powered resume parsing and matching. Upload resumes, define job requirements, and get automatically ranked candidates based on skill match, experience, and education alignment.

## ✨ Key Features

### 🔐 Authentication & User Management

- **Google OAuth** - Seamless single sign-on
- **Email/Password Authentication** - Traditional registration and login
- **Password Reset** - Secure password recovery flow
- **Organization-Based Access Control** - Multi-tenant architecture
- **Role-Based Permissions** - Admin, Recruiter, Viewer roles

### 📋 Job Posting System

- Create, edit, archive job postings
- Define required and nice-to-have skills
- Set experience level and education requirements
- Configure salary ranges and job location
- Job status management (Open, Closed, Paused, Draft)

### 📄 Resume Management

- **Secure Upload** - PDF, DOCX, and TXT file support
- **Automatic Parsing** - Extract skills, experience, education
- **Data Normalization** - Structured resume data storage
- **File Storage** - Supabase Storage integration
- **Preview & Download** - Easy resume access

### 🧠 AI-Powered Matching

- **Automated Ranking** - Candidates ranked by match score
- **Skill Matching** - Required vs. nice-to-have skill analysis
- **Experience Evaluation** - Years of experience alignment
- **Education Verification** - Education level matching
- **Customizable Scoring** - Configurable match weights

### 👥 Applicant Management

- **Applicant Profiles** - Complete candidate information
- **Status Pipeline** - Applied → Shortlisted → Interview → Hired/Rejected
- **Notes & Tags** - Internal notes and custom tagging
- **Resume Preview** - View parsed resume data
- **Bulk Actions** - Update multiple applicants efficiently

### 📊 Analytics & Dashboard

- **Hiring Funnel** - Conversion rates at each stage
- **Match Score Distribution** - Visual insights on applicant quality
- **Skill Frequency Analysis** - In-demand skills breakdown
- **Upload Trends** - Applicant submission patterns
- **Performance Metrics** - Hiring efficiency KPIs

## 🏗️ Architecture

### Technology Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript (strict mode)
- **Package Manager**: pnpm
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth + Google OAuth
- **UI Library**: Radix UI
- **Styling**: Tailwind CSS
- **Visualization**: Recharts
- **State Management**: Zustand

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/             # React components (presentational only)
│   ├── ui/                # Base UI components (Button, Input, Card, etc.)
│   └── shared/            # Shared components (Navigation, Alerts, etc.)
├── hooks/                 # Custom React hooks (business logic)
│   ├── auth/              # Authentication hooks
│   ├── jobs/              # Job management hooks
│   ├── applicants/        # Applicant management hooks
│   ├── analytics/         # Analytics and data hooks
│   └── ai/                # AI matching hooks
├── types/                 # TypeScript type definitions
├── lib/                   # Utility functions and configurations
│   ├── supabase/          # Supabase client setup
│   ├── theme/             # Theme utilities
│   └── utils/             # Common utilities
├── config/                # App configuration
├── constants/             # Application constants
└── styles/                # Global styles
```

### Architecture Principles

1. **Clean Separation of Concerns** - Components are presentational, hooks contain all logic
2. **Type Safety** - Strict TypeScript everywhere, no `any` types
3. **Single Responsibility** - Hooks do one thing well
4. **Composition Over Duplication** - Reusable hooks and components
5. **SSR-Safe** - All data fetching in hooks or server components
6. **Scalable** - Easy to extend and maintain by future developers

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- pnpm 10.0 or later
- Supabase account
- Google OAuth credentials (optional)

### Installation

1. **Clone the repository**

   ```bash
   cd hirelens
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.local.example .env.local
   ```

   Fill in your Supabase credentials:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Set up Supabase database**
   - Create tables using the schema in `docs/supabase-schema.sql`
   - Enable Row Level Security (RLS) on all tables
   - Create policies for multi-tenant access

5. **Start development server**
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

- [WORKFLOWS.md](./WORKFLOWS.md) - AI agent instructions for extending the project
- [Supabase Schema](./docs/supabase-schema.sql) - Database structure
- [API Documentation](./docs/API.md) - Endpoint specifications
- [Component Guide](./docs/COMPONENTS.md) - UI component usage

## 🔧 Development Workflows

### Adding a New Feature

1. Create types in `/types/`
2. Create custom hook in `/hooks/`
3. Create UI components in `/components/`
4. Create API route in `/app/api/`
5. Update WORKFLOWS.md with new patterns

### Extending the Application

- Follow existing patterns in hooks and components
- Never put business logic in components
- Always define types before implementation
- Write self-documenting code with JSDoc comments

### Commit Messages

Follow conventional commits:

```
feat(scope): description
fix(scope): description
refactor(scope): description
docs(scope): description
```

## 🧪 Quality Standards

- **Type Safety**: No `any` types, strict mode enabled
- **Error Handling**: Graceful error handling throughout
- **Performance**: Optimized queries and caching strategies
- **Accessibility**: ARIA-compliant components
- **Scalability**: Architecture supports millions of applicants

## 🔒 Security

- **Row Level Security (RLS)** - Database-level access control
- **Authentication** - Supabase Auth with session management
- **HTTPS Only** - All external communication encrypted
- **No Sensitive Data in Logs** - PII protection
- **File Validation** - Resume file type and size validation

## 📈 Performance

- **Database Indexing** - Optimized query performance
- **Pagination** - Efficient data loading
- **Caching** - Browser and server-side caching
- **CDN Integration** - Asset delivery optimization
- **Lazy Loading** - Component code splitting

## 🤝 Contributing

1. Create a feature branch from `main`
2. Implement changes following architecture rules
3. Write clear commit messages
4. Push to remote and create a pull request
5. Ensure all tests pass and code is reviewed

## 📝 License

Proprietary - All rights reserved

## 🆘 Support

For issues and questions:

- Check existing documentation
- Review similar implementations in the codebase
- Consult WORKFLOWS.md for patterns
- Create an issue with detailed description

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
