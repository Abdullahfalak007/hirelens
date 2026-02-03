"use client";

import { useCallback, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import type { UpdateJobInput, Job } from "@/types";

export function useUpdateJob() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateJob = useCallback(
    async (jobId: string, input: UpdateJobInput): Promise<Job> => {
      try {
        setLoading(true);
        setError(null);

        const supabase = createClient() as any;

        const { data: job, error: jobErr } = await supabase
          .from("jobs")
          .update({
            ...(input.title && { title: input.title }),
            ...(input.description && { description: input.description }),
            ...(input.requirements !== undefined && {
              requirements: input.requirements,
            }),
            ...(input.location && { location: input.location }),
            ...(input.is_remote !== undefined && {
              is_remote: input.is_remote,
            }),
            ...(input.experience_level && {
              experience_level: input.experience_level,
            }),
            ...(input.required_education && {
              required_education: input.required_education,
            }),
            ...(input.min_experience_years !== undefined && {
              min_experience_years: input.min_experience_years,
            }),
            ...(input.max_experience_years !== undefined && {
              max_experience_years: input.max_experience_years,
            }),
            ...(input.salary_min !== undefined && {
              salary_min: input.salary_min,
            }),
            ...(input.salary_max !== undefined && {
              salary_max: input.salary_max,
            }),
            ...(input.status && { status: input.status }),
            updated_at: new Date().toISOString(),
          })
          .eq("id", jobId)
          .select()
          .single();

        if (jobErr) throw new Error(jobErr.message);
        if (!job) throw new Error("Failed to update job");

        return job as Job;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update job";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { updateJob, loading, error };
}
