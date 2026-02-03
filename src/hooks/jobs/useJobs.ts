"use client";

import { useEffect, useState } from "react";
import type { Job } from "@/types";

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
