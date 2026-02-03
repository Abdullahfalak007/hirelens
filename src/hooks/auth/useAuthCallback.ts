"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "./useAuth";

export function useAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session, loading: authLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setLoading(true);

        // Check if there's an error in the callback
        const errorCode = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        if (errorCode) {
          throw new Error(errorDescription || "Authentication failed");
        }

        // Wait for auth loading to complete
        if (!authLoading) {
          if (session?.isAuthenticated) {
            // Successfully authenticated
            router.push("/dashboard");
          } else {
            throw new Error("No session established");
          }
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Authentication callback failed";
        setError(message);
        // Redirect to login page after a delay
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [router, searchParams, session, authLoading]);

  return { error, loading };
}
