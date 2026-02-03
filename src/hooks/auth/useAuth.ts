/**
 * Authentication hook
 * Manages user authentication state and session
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { AuthSession, User } from "@/types";

export function useAuth() {
  const [session, setSession] = useState<AuthSession>({
    user: null,
    session: null,
    isAuthenticated: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // Check initial session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session: authSession },
          error: err,
        } = await supabase.auth.getSession();

        if (err) {
          setError(err.message);
          setLoading(false);
          return;
        }

        if (authSession) {
          // Fetch user data from database
          const { data: userData, error: userErr } = await supabase
            .from("users")
            .select("*")
            .eq("id", authSession.user.id)
            .single();

          if (userErr) {
            console.error("Error fetching user data:", userErr);
          } else {
            setSession({
              user: userData,
              session: authSession,
              isAuthenticated: true,
            });
          }
        }
      } catch (err) {
        console.error("Session check error:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, authSession) => {
      if (authSession?.user) {
        const { data: userData } = await supabase
          .from("users")
          .select("*")
          .eq("id", authSession.user.id)
          .single();

        setSession({
          user: userData,
          session: authSession,
          isAuthenticated: true,
        });
      } else {
        setSession({
          user: null,
          session: null,
          isAuthenticated: false,
        });
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase]);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      const { error: err } = await supabase.auth.signOut();
      if (err) throw err;

      setSession({
        user: null,
        session: null,
        isAuthenticated: false,
      });
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign out failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const signInWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${appUrl}/auth/callback`,
        },
      });

      if (err) throw err;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Google sign in failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  return {
    ...session,
    loading,
    error,
    signOut,
    signInWithGoogle,
  };
}
