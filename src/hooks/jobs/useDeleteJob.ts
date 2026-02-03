"use client";

import { useCallback, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

export function useDeleteJob() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteJob = useCallback(async (jobId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const supabase = createClient() as any;

      const { error: jobErr } = await supabase
        .from("jobs")
        .delete()
        .eq("id", jobId);

      if (jobErr) throw new Error(jobErr.message);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete job";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteJob, loading, error };
}
