/**
 * Job posting and position-related types
 */

export type ExperienceLevel = "entry" | "mid" | "senior" | "lead" | "executive";
export type EducationLevel = "high_school" | "bachelors" | "masters" | "phd";
export type JobStatus = "open" | "closed" | "paused" | "draft";

export interface Skill {
  id: string;
  name: string;
  category?: string;
  created_at: string;
}

export interface JobRequirement {
  id: string;
  job_id: string;
  skill_id: string;
  skill: Skill;
  is_required: boolean;
  proficiency_level?: "beginner" | "intermediate" | "advanced" | "expert";
  years_of_experience?: number;
}

export interface Job {
  id: string;
  organization_id: string;
  title: string;
  description: string;
  requirements: string | null;
  status: JobStatus;
  min_experience_years: number;
  max_experience_years?: number;
  experience_level: ExperienceLevel;
  required_education: EducationLevel;
  salary_min?: number;
  salary_max?: number;
  location: string;
  is_remote: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
}

export interface JobFilters {
  status?: JobStatus;
  experience_level?: ExperienceLevel;
  is_remote?: boolean;
  search?: string;
}

export interface CreateJobInput {
  title: string;
  description: string;
  requirements?: string;
  status?: JobStatus;
  min_experience_years: number;
  max_experience_years?: number;
  experience_level: ExperienceLevel;
  required_education: EducationLevel;
  salary_min?: number;
  salary_max?: number;
  location: string;
  is_remote: boolean;
  required_skills: string[]; // Array of skill IDs
  nice_to_have_skills?: string[]; // Array of skill IDs
}

export interface UpdateJobInput {
  title?: string;
  description?: string;
  requirements?: string;
  status?: JobStatus;
  min_experience_years?: number;
  max_experience_years?: number;
  experience_level?: ExperienceLevel;
  required_education?: EducationLevel;
  salary_min?: number;
  salary_max?: number;
  location?: string;
  is_remote?: boolean;
}
