"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { useCreateJob } from "@/hooks/jobs";
import type { CreateJobInput } from "@/types";

export const dynamic = "force-dynamic";

export default function CreateJobPage() {
  const router = useRouter();
  const { createJob, loading, error } = useCreateJob();
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<CreateJobInput>>({
    title: "",
    description: "",
    location: "",
    experience_level: "mid",
    required_education: "bachelors",
    is_remote: false,
    min_experience_years: 0,
    required_skills: [],
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (name.includes("experience_years") || name.includes("salary")) {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? parseInt(value) : 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.title || !formData.description) {
      setFormError("Title and description are required");
      return;
    }

    try {
      await createJob(formData as CreateJobInput);
      router.push("/dashboard/jobs");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to create job");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button variant="outline" onClick={() => router.back()}>
            ← Back
          </Button>
        </div>

        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-2">Post New Job</h1>
          <p className="text-gray-600 mb-6">Fill in the job details below</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <Input
                type="text"
                name="title"
                placeholder="Senior React Developer"
                value={formData.title || ""}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                placeholder="Describe the role, responsibilities, and requirements..."
                value={formData.description || ""}
                onChange={handleChange}
                disabled={loading}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <Input
                type="text"
                name="location"
                placeholder="San Francisco, CA or Remote"
                value={formData.location || ""}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            {/* Remote */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_remote"
                checked={formData.is_remote || false}
                onChange={handleChange}
                disabled={loading}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label className="ml-2 block text-sm text-gray-700">
                This is a remote position
              </label>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Level
              </label>
              <select
                name="experience_level"
                value={formData.experience_level || ""}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead</option>
                <option value="executive">Executive</option>
              </select>
            </div>

            {/* Education */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Education
              </label>
              <select
                name="required_education"
                value={formData.required_education || ""}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="high_school">High School</option>
                <option value="bachelors">Bachelor's Degree</option>
                <option value="masters">Master's Degree</option>
                <option value="phd">PhD</option>
              </select>
            </div>

            {/* Experience Years */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Experience (Years)
                </label>
                <Input
                  type="number"
                  name="min_experience_years"
                  placeholder="0"
                  value={formData.min_experience_years || 0}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Experience (Years)
                </label>
                <Input
                  type="number"
                  name="max_experience_years"
                  placeholder="10"
                  value={formData.max_experience_years || ""}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Salary Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Salary (Optional)
                </label>
                <Input
                  type="number"
                  name="salary_min"
                  placeholder="80000"
                  value={formData.salary_min || ""}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Salary (Optional)
                </label>
                <Input
                  type="number"
                  name="salary_max"
                  placeholder="150000"
                  value={formData.salary_max || ""}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Error Message */}
            {(error || formError) && (
              <div className="p-4 bg-red-50 text-red-700 rounded-md text-sm">
                {error || formError}
              </div>
            )}

            {/* Submit */}
            <div className="flex gap-4">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? "Creating..." : "Create Job"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
