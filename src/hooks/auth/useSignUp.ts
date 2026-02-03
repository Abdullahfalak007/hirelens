/**
 * Sign up hook
 * Handles user registration with email, password, and organization
 */

"use client";

import { useCallback, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import type { SignUpCredentials, User } from "@/types";

export interface SignUpWithOrgInput extends SignUpCredentials {
  organization_name: string;
  organization_slug: string;
}

export interface SignUpResult {
  user: User;
  organization_id: string;
}

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

  const signUpWithOrganization = useCallback(
    async (input: SignUpWithOrgInput): Promise<SignUpResult> => {
      try {
        setLoading(true);
        setError(null);

        const supabase = createClient() as any;

        // 1. Create auth user
        const { data: authData, error: authErr } = await supabase.auth.signUp({
          email: input.email,
          password: input.password,
          options: {
            data: {
              full_name: input.full_name,
            },
          },
        });

        if (authErr) throw new Error(authErr.message);
        if (!authData.user) throw new Error("Failed to create user");

        const authUserId = authData.user.id;

        // 2. Create organization
        const { data: org, error: orgErr } = await supabase
          .from("organizations")
          .insert([
            {
              name: input.organization_name,
              slug: input.organization_slug,
            },
          ])
          .select()
          .single();

        if (orgErr)
          throw new Error(orgErr.message || "Failed to create organization");
        if (!org) throw new Error("Failed to create organization");

        // 3. Create app_users record
        const { data: appUser, error: userErr } = await supabase
          .from("app_users")
          .insert([
            {
              auth_id: authUserId,
              email: input.email,
              full_name: input.full_name,
              organization_id: org.id,
              role: "admin",
            },
          ])
          .select()
          .single();

        if (userErr)
          throw new Error(userErr.message || "Failed to create user record");
        if (!appUser) throw new Error("Failed to create user record");

        // 4. Create organization membership
        await supabase.from("organization_members").insert([
          {
            organization_id: org.id,
            user_id: appUser.id,
            role: "admin",
          },
        ]);

        return {
          user: appUser as unknown as User,
          organization_id: org.id,
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Sign up failed";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    signUp,
    signUpWithOrganization,
    loading,
    error,
  };
}
