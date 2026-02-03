# WORKFLOWS.md - AI Agent Development Guide

This document provides instructions for AI agents extending and maintaining the Hirelens platform. Follow these patterns and rules to ensure consistency and quality.

## 🎯 Core Principles

### Architecture Rules (NON-NEGOTIABLE)

1. **Components are DUMB (Presentational Only)**
   - No business logic in components
   - No hooks with data fetching in components
   - Only receive props and render UI
   - Use Radix UI for base components

2. **Hooks are SMART (Business Logic)**
   - All data fetching goes in hooks
   - All state management in hooks
   - Custom hooks handle one responsibility
   - No component-specific hooks

3. **Types Defined in `/types/`**
   - Never define types in components, hooks, or API routes
   - Import types from `@/types` index
   - Maintain type hierarchy: DB types → Domain types → API types

4. **No Inline Styling or Colors**
   - Use Tailwind CSS classes only
   - Colors come from `src/config/theme.ts`
   - No hardcoded hex colors or RGB values
   - No inline `style` attribute

5. **File Organization Matters**
   - Put code in the correct folder
   - Respect folder boundaries
   - Use meaningful file names
   - One main export per file

## 📁 Where Code Lives

### Types (`/src/types/`)

```
types/
├── index.ts         # Export all types
├── auth.ts          # Auth & user types
├── job.ts           # Job posting types
├── applicant.ts     # Applicant types
├── analytics.ts     # Analytics types
├── ai.ts            # AI matching types
└── database.ts      # DB schema types
```

**Rule**: Add new types immediately when creating features.

### Hooks (`/src/hooks/`)

```
hooks/
├── auth/
│   ├── useAuth.ts        # Current session
│   ├── useLogin.ts       # Login logic
│   ├── useSignUp.ts      # Registration
│   └── usePasswordReset.ts
├── jobs/
│   ├── useJobs.ts        # List jobs
│   ├── useJob.ts         # Single job
│   ├── useCreateJob.ts   # Create/edit
│   └── useDeleteJob.ts
├── applicants/
│   ├── useApplicants.ts  # List applicants
│   ├── useApplicant.ts   # Single applicant
│   ├── useUpdateApplicant.ts
│   └── useApplicantFilters.ts
├── analytics/
│   ├── useDashboardMetrics.ts
│   ├── useJobAnalytics.ts
│   └── useSkillAnalytics.ts
└── ai/
    ├── useResumeParser.ts
    ├── useMatching.ts
    └── useRanking.ts
```

**Rule**: Each hook handles ONE responsibility. If a hook grows, split it.

### Components (`/src/components/`)

```
components/
├── ui/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Dialog.tsx
│   ├── Select.tsx
│   ├── Tabs.tsx
│   ├── Badge.tsx
│   └── Avatar.tsx
└── shared/
    ├── Navigation.tsx
    ├── Header.tsx
    ├── Sidebar.tsx
    ├── Footer.tsx
    └── LoadingSpinner.tsx
```

**Rule**: Components receive ALL data via props. No data fetching.

### Library Utilities (`/src/lib/`)

```
lib/
├── supabase/
│   └── client.ts         # Supabase clients
├── utils/
│   ├── common.ts         # Format, parse, convert
│   ├── errors.ts         # Error classes
│   ├── validation.ts     # Input validation
│   └── parsing.ts        # Resume/data parsing
└── theme/
    └── colors.ts         # Color utilities
```

**Rule**: Utilities are PURE FUNCTIONS. No side effects.

## 🔄 Development Workflow

### Adding a New Feature

**Step 1: Define Types**

```typescript
// src/types/newfeature.ts
export interface MyFeature {
  id: string;
  name: string;
  created_at: string;
}

// Update src/types/index.ts
export * from "./newfeature";
```

**Step 2: Create Hook(s)**

```typescript
// src/hooks/myfeature/useMyFeature.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { MyFeature } from "@/types";
import { handleSupabaseError } from "@/lib/utils/errors";

export function useMyFeature() {
  const [data, setData] = useState<MyFeature[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from("my_features")
        .select("*");

      if (err) throw handleSupabaseError(err);
      setData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
```

**Step 3: Create Components**

```typescript
// src/components/shared/MyFeatureList.tsx
'use client';

import { useMyFeature } from '@/hooks';
import { Button } from '@/components/ui';
import type { MyFeature } from '@/types';

interface MyFeatureListProps {
  items: MyFeature[];
  onSelect: (item: MyFeature) => void;
  loading?: boolean;
}

export function MyFeatureList({ items, onSelect, loading }: MyFeatureListProps) {
  if (loading) return <div>Loading...</div>;
  if (!items.length) return <div>No items found</div>;

  return (
    <div>
      {items.map((item) => (
        <div key={item.id}>
          <span>{item.name}</span>
          <Button onClick={() => onSelect(item)}>Select</Button>
        </div>
      ))}
    </div>
  );
}
```

**Step 4: Create Page**

```typescript
// src/app/myfeature/page.tsx
'use client';

import { useMyFeature } from '@/hooks';
import { MyFeatureList } from '@/components/shared';

export default function MyFeaturePage() {
  const { data, loading, error } = useMyFeature();

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>My Feature</h1>
      <MyFeatureList items={data || []} onSelect={() => {}} loading={loading} />
    </div>
  );
}
```

**Step 5: Create API Route (if needed)**

```typescript
// src/app/api/myfeature/route.ts
import { createServerComponentClient } from "@/lib/supabase/client";
import { handleApiError } from "@/lib/utils/errors";

export async function GET(req: Request) {
  try {
    const supabase = await createServerComponentClient();
    const { data, error } = await supabase.from("my_features").select("*");

    if (error) throw error;
    return Response.json({ data });
  } catch (error) {
    const err = handleApiError(error);
    return Response.json(err, { status: err.statusCode });
  }
}
```

## ✅ Code Review Checklist

Before considering a feature complete, verify:

- [ ] **Types defined** in `/types/` and exported from `index.ts`
- [ ] **No business logic in components** - all moved to hooks
- [ ] **No data fetching in components** - fetching in hooks only
- [ ] **No inline styles** - all Tailwind or theme config
- [ ] **No hardcoded colors** - using theme tokens
- [ ] **Proper error handling** - try/catch and user-friendly messages
- [ ] **TypeScript strict mode** - no `any` types
- [ ] **Comments on complex logic** - JSDoc where needed
- [ ] **Consistent naming** - camelCase variables, PascalCase components
- [ ] **Single responsibility** - each file/function does one thing
- [ ] **Proper imports** - using `@/` aliases

## 🐛 Common Mistakes to Avoid

### ❌ DON'T

```typescript
// ❌ Business logic in component
export function MyComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(setData);
  }, []);

  return <div>{data.name}</div>;
}

// ❌ Hardcoded colors
<div style={{ color: '#0ea5e9' }}>Text</div>

// ❌ Types defined in component
interface User { id: string; name: string; }

// ❌ No error handling
const result = await supabase.from('users').select();
setUsers(result.data);

// ❌ God hook
export function useEverything() {
  // 500 lines of code
}
```

### ✅ DO

```typescript
// ✅ Business logic in hook
export function useMyData() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await fetchData();
        setData(res);
      } catch (err) {
        handleError(err);
      }
    };
    fetch();
  }, []);

  return { data };
}

// ✅ Use theme colors
<div className="text-primary-500">Text</div>

// ✅ Types in /types/
import type { User } from '@/types';

// ✅ Proper error handling
try {
  const { data, error } = await supabase.from('users').select();
  if (error) throw error;
  setUsers(data);
} catch (err) {
  setError(handleError(err));
}

// ✅ Single-responsibility hooks
export function useUsers() { /* fetch users */ }
export function useUserCreate() { /* create user */ }
export function useUserDelete() { /* delete user */ }
```

## 📝 Commit Message Format

Use conventional commits:

```
feat(scope): description
fix(scope): description
refactor(scope): description
docs(scope): description
chore(scope): description
```

Examples:

```
feat(auth): add Google OAuth login
fix(applicants): correct resume parsing edge case
refactor(hooks): split applicant ranking logic into separate hooks
docs(README): update installation instructions
chore(deps): upgrade Supabase client
```

## 🔒 Security Checklist

- [ ] **No API keys in client code** - only in `.env.local`
- [ ] **RLS enabled** on all Supabase tables
- [ ] **Check user permissions** before operations
- [ ] **Validate file uploads** - type and size
- [ ] **No sensitive data in logs** - PII protection
- [ ] **Use environment variables** for all secrets

## 🚀 Performance Guidelines

- [ ] **Memoize expensive computations** - use `useMemo`
- [ ] **Avoid unnecessary re-renders** - use `useCallback`
- [ ] **Lazy load components** - `React.lazy()` for routes
- [ ] **Optimize images** - use Next.js Image component
- [ ] **Bundle analysis** - keep chunks under 200KB
- [ ] **Database queries** - use proper pagination and indexing

## 📊 Testing Strategy

Although this project doesn't have tests yet, follow these patterns for future implementation:

```typescript
// ✅ Testable hook
export function useCounter() {
  const [count, setCount] = useState(0);
  return {
    count,
    increment: () => setCount(c => c + 1),
  };
}

// ✅ Testable component
export function Counter({ initial = 0, onCount }: Props) {
  const { count, increment } = useCounter();
  return (
    <button onClick={() => { increment(); onCount?.(count); }}>
      Count: {count}
    </button>
  );
}
```

## 🎓 Learning Resources

- Read existing implementations in `/src/hooks/auth/` for auth patterns
- Study `/src/components/ui/` for component composition
- Review `/types/` for type hierarchy
- Check `.env.local.example` for required configuration

## ❓ Troubleshooting

### "Cannot find module"

- Check imports use `@/` alias
- Verify file path is correct
- Clear `.next` directory and rebuild

### TypeScript strict mode errors

- Don't use `any` - properly type everything
- Check function return types
- Verify imported types match usage

### Supabase auth errors

- Ensure environment variables are set
- Check RLS policies allow operation
- Verify user session is valid

## 🔗 Related Documentation

- [README.md](./README.md) - Project overview
- [src/config/theme.ts](./src/config/theme.ts) - Theme tokens
- [src/constants/index.ts](./src/constants/index.ts) - App constants
- [src/lib/utils/errors.ts](./src/lib/utils/errors.ts) - Error handling

---

**Last Updated**: February 4, 2026
**Version**: 1.0.0
