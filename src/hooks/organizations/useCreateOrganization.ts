"use client";

import { useCallback, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import type { Organization, User } from "@/types";

export interface CreateOrganizationInput {
  name: string;
  slug: string;
}

export function useCreateOrganization() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrganization = useCallback(
    async (input: CreateOrganizationInput): Promise<Organization> => {
      try {
        setLoading(true);
        setError(null);

        const supabase = createClient() as any;

        // Check if slug already exists
        const { data: existing } = await supabase
          .from("organizations")
          .select("id")
          .eq("slug", input.slug)
          .limit(1)
          .single();

        if (existing) {
          throw new Error("Organization slug already in use");
        }

        // Create organization
        const { data: org, error: orgErr } = await supabase
          .from("organizations")
          .insert({
            name: input.name,
            slug: input.slug,
          })
          .select()
          .single();

        if (orgErr) throw orgErr;
        if (!org) throw new Error("Failed to create organization");

        return org;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to create organization";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    createOrganization,
    loading,
    error,
  };
}
