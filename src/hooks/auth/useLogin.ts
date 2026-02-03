/**
 * Login hook
 * Handles user login with email and password
 */

"use client";

import { useCallback, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { LoginCredentials } from "@/types";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: err } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (err) {
          throw new Error(err.message);
        }

        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Login failed";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [supabase],
  );

  return {
    login,
    loading,
    error,
  };
}
