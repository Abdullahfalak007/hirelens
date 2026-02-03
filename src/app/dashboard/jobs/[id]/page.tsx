"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { useUpdateJob, useDeleteJob } from "@/hooks/jobs";
import type { Job } from "@/types";

export const dynamic = "force-dynamic";

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;
  const { updateJob, loading: updating } = useUpdateJob();
  const { deleteJob, loading: deleting } = useDeleteJob();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState<Partial<Job>>({});

  // Fetch job details
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const supabase = createClient() as any;
        const { data, error: err } = await supabase
          .from("jobs")
          .select("*")
          .eq("id", jobId)
          .single();

        if (err) throw new Error(err.message);
        setJob(data);
        setFormData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load job");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

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
        [name]: value ? parseInt(value) : undefined,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    setFormError(null);

    if (!formData.title || !formData.description) {
      setFormError("Title and description are required");
      return;
    }

    try {
      // Filter out null values to match UpdateJobInput type
      const updateData: Record<string, any> = {};
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          updateData[key] = value;
        }
      });

      await updateJob(jobId, updateData);
      setJob((prev) => (prev ? { ...prev, ...updateData } : null));
      setIsEditing(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to update job");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteJob(jobId);
      router.push("/dashboard/jobs");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to delete job");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="p-8 text-center">
            <p className="text-red-600 mb-4">{error || "Job not found"}</p>
            <Button onClick={() => router.back()}>← Back</Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button variant="outline" onClick={() => router.back()}>
            ← Back
          </Button>
        </div>

        <Card className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {isEditing ? "Edit Job" : job.title}
              </h1>
              <p className="text-gray-600">ID: {job.id}</p>
            </div>
            {!isEditing && (
              <div className="flex gap-2">
                <Button onClick={() => setIsEditing(true)}>Edit</Button>
                <Button
                  variant="danger"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>

          {isEditing ? (
            <form className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title *
                </label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleChange}
                  disabled={updating}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  disabled={updating}
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
                  value={formData.location || ""}
                  onChange={handleChange}
                  disabled={updating}
                />
              </div>

              {/* Remote */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_remote"
                  checked={formData.is_remote || false}
                  onChange={handleChange}
                  disabled={updating}
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
                  disabled={updating}
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
                  disabled={updating}
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
                    value={formData.min_experience_years || ""}
                    onChange={handleChange}
                    disabled={updating}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Experience (Years)
                  </label>
                  <Input
                    type="number"
                    name="max_experience_years"
                    value={formData.max_experience_years || ""}
                    onChange={handleChange}
                    disabled={updating}
                  />
                </div>
              </div>

              {/* Salary Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Salary
                  </label>
                  <Input
                    type="number"
                    name="salary_min"
                    value={formData.salary_min || ""}
                    onChange={handleChange}
                    disabled={updating}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Salary
                  </label>
                  <Input
                    type="number"
                    name="salary_max"
                    value={formData.salary_max || ""}
                    onChange={handleChange}
                    disabled={updating}
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status || "draft"}
                  onChange={handleChange}
                  disabled={updating}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="open">Open</option>
                  <option value="paused">Paused</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {/* Error Message */}
              {formError && (
                <div className="p-4 bg-red-50 text-red-700 rounded-md text-sm">
                  {formError}
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={updating}
                  className="flex-1"
                >
                  {updating ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  disabled={updating}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900">Description</h3>
                <p className="text-gray-700 mt-2 whitespace-pre-wrap">
                  {job.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Location</h3>
                  <p className="text-gray-700">
                    {job.location || "Not specified"}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Remote</h3>
                  <p className="text-gray-700">
                    {job.is_remote ? "Yes" : "No"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Experience Level
                  </h3>
                  <p className="text-gray-700 capitalize">
                    {job.experience_level?.replace("-", " ")}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Status</h3>
                  <p className="text-gray-700 capitalize">{job.status}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Min Experience
                  </h3>
                  <p className="text-gray-700">
                    {job.min_experience_years} years
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Max Experience
                  </h3>
                  <p className="text-gray-700">
                    {job.max_experience_years
                      ? `${job.max_experience_years} years`
                      : "Not specified"}
                  </p>
                </div>
              </div>

              {(job.salary_min || job.salary_max) && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">Min Salary</h3>
                    <p className="text-gray-700">
                      {job.salary_min
                        ? `$${job.salary_min.toLocaleString()}`
                        : "Not specified"}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Max Salary</h3>
                    <p className="text-gray-700">
                      {job.salary_max
                        ? `$${job.salary_max.toLocaleString()}`
                        : "Not specified"}
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Created: {new Date(job.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="p-8 max-w-md">
              <h2 className="text-xl font-bold mb-4">Delete Job?</h2>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this job? This action cannot be
                undone.
              </p>
              <div className="flex gap-4">
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
