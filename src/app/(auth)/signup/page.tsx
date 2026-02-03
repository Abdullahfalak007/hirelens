"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { useSignUp } from "@/hooks/auth";

export const dynamic = "force-dynamic";

export default function SignupPage() {
  const router = useRouter();
  const { signUpWithOrganization, loading, error } = useSignUp();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    organization_name: "",
    organization_slug: "",
  });
  const [localError, setLocalError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Auto-generate slug from org name
    if (name === "organization_name") {
      setFormData((prev) => ({
        ...prev,
        organization_slug: value.toLowerCase().replace(/\s+/g, "-"),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const { full_name, email, password, organization_name } = formData;

    if (!full_name || !email || !password || !organization_name) {
      setLocalError("Please fill in all fields");
      return;
    }

    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters");
      return;
    }

    try {
      await signUpWithOrganization({
        full_name,
        email,
        password,
        organization_name,
        organization_slug: formData.organization_slug,
      });
      router.push("/dashboard");
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Sign up failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-2">Create Account</h1>
        <p className="text-gray-600 mb-6">Start using Hirelens today</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <Input
              type="text"
              name="full_name"
              placeholder="John Doe"
              value={formData.full_name}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <Input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">At least 8 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organization Name
            </label>
            <Input
              type="text"
              name="organization_name"
              placeholder="Acme Inc."
              value={formData.organization_name}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          {(error || localError) && (
            <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error || localError}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Sign in
          </a>
        </p>
      </Card>
    </div>
  );
}
