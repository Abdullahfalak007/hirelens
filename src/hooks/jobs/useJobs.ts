"use client";

import { useEffect, useState } from "react";

export type Job = {
  id: string;
  title: string;
  description?: string;
  location?: string;
  employment_type?: string;
  experience_level?: string;
  min_salary?: number;
  max_salary?: number;
  status?: string;
  created_at?: string;
};

export function useJobs() {
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    fetch("/api/jobs")
      .then(async (res) => {
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const payload = await res.json();
        if (mounted) setJobs(payload.data ?? []);
      })
      .catch((err: any) => {
        if (mounted) setError(err?.message ?? String(err));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { jobs, loading, error };
}
