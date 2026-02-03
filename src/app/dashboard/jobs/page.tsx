"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useJobs } from "@/hooks/jobs";
import type { Job } from "@/types";

export const dynamic = "force-dynamic";

export default function JobsListPage() {
  const router = useRouter();
  const { jobs, loading, error } = useJobs();
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "draft" | "open" | "paused" | "closed"
  >("all");

  useEffect(() => {
    if (!jobs) return;

    const filtered =
      statusFilter === "all"
        ? jobs
        : jobs.filter((job) => job.status === statusFilter);
    setFilteredJobs(filtered);
  }, [jobs, statusFilter]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Jobs</h1>
          <Button onClick={() => router.push("/dashboard/jobs/new")}>
            + Post New Job
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-2">
          {(["all", "draft", "open", "paused", "closed"] as const).map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  statusFilter === status
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ),
          )}
        </div>

        {error && (
          <Card className="p-4 bg-red-50 text-red-700 mb-6">{error}</Card>
        )}

        {loading ? (
          <Card className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Loading jobs...</p>
          </Card>
        ) : filteredJobs.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-600 mb-4">No jobs found</p>
            <Button onClick={() => router.push("/dashboard/jobs/new")}>
              Post Your First Job
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredJobs.map((job) => (
              <Card
                key={job.id}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/dashboard/jobs/${job.id}`)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {job.title}
                    </h3>
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {job.description}
                    </p>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-700">
                      {job.location && (
                        <span className="flex items-center gap-1">
                          📍 {job.location}
                        </span>
                      )}
                      {job.is_remote && (
                        <span className="flex items-center gap-1">
                          🌐 Remote
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        📚 {job.experience_level?.replace("-", " ")}
                      </span>
                      {job.salary_min && job.salary_max && (
                        <span className="flex items-center gap-1">
                          💰 ${job.salary_min.toLocaleString()} - $
                          {job.salary_max.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        job.status === "draft"
                          ? "bg-gray-100 text-gray-800"
                          : job.status === "open"
                            ? "bg-green-100 text-green-800"
                            : job.status === "paused"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                      }`}
                    >
                      {job.status?.charAt(0).toUpperCase() +
                        job.status?.slice(1)}
                    </span>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(job.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
