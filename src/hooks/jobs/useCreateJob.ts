"use client";

import { useCallback, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import type { CreateJobInput } from "@/types";

export function useCreateJob() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createJob = useCallback(async (input: CreateJobInput) => {
    try {
      setLoading(true);
      setError(null);

      const supabase = createClient() as any;

      // Get current user's organization
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: appUser } = await supabase
        .from("app_users")
        .select("organization_id")
        .eq("auth_id", user.id)
        .single();

      if (!appUser) throw new Error("User profile not found");

      // Create job
      const { data: job, error: jobErr } = await supabase
        .from("jobs")
        .insert([
          {
            organization_id: appUser.organization_id,
            title: input.title,
            description: input.description,
            requirements: input.requirements,
            status: "draft",
            min_experience_years: input.min_experience_years || 0,
            max_experience_years: input.max_experience_years,
            experience_level: input.experience_level,
            required_education: input.required_education,
            salary_min: input.salary_min,
            salary_max: input.salary_max,
            location: input.location,
            is_remote: input.is_remote || false,
            created_by: user.id,
          },
        ])
        .select()
        .single();

      if (jobErr) throw new Error(jobErr.message);
      if (!job) throw new Error("Failed to create job");

      return job;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create job";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createJob, loading, error };
}
