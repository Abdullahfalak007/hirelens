/**
 * Sign up hook
 * Handles user registration with email, password, and organization
 */

"use client";

import { useCallback, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { SignUpCredentials } from "@/types";

export function useSignUp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signUp = useCallback(async (credentials: SignUpCredentials) => {
    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();

      // 1. Create auth user
      const { data: authData, error: authErr } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            full_name: credentials.full_name,
          },
        },
      });

      if (authErr) {
        throw new Error(authErr.message);
      }

      if (!authData.user) {
        throw new Error("Failed to create user");
      }

      // For now, just return the auth user
      // Full implementation with org and user records will be added after Supabase schema setup
      return {
        user: authData.user,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign up failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    signUp,
    loading,
    error,
  };
}
