/**
 * Applicant and resume-related types
 */

export type ApplicantStatus =
  | "applied"
  | "shortlisted"
  | "interview"
  | "rejected"
  | "hired";
export type ResumeFileType = "pdf" | "docx" | "txt";

export interface ResumeData {
  id: string;
  applicant_id: string;
  file_url: string;
  file_name: string;
  file_type: ResumeFileType;
  file_size: number;
  raw_text: string | null;
  parsed_data: ParsedResumeData | null;
  uploaded_at: string;
  processed_at: string | null;
}

export interface ParsedResumeData {
  full_name?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  skills: string[];
  experience: WorkExperience[];
  education: Education[];
  certifications?: Certification[];
  languages?: Language[];
}

export interface WorkExperience {
  company: string;
  title: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
  skills_used?: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field_of_study?: string;
  graduation_date: string;
  gpa?: number;
}

export interface Certification {
  name: string;
  issuer: string;
  issue_date: string;
  expiration_date?: string;
}

export interface Language {
  name: string;
  proficiency: "beginner" | "intermediate" | "advanced" | "fluent" | "native";
}

export interface Applicant {
  id: string;
  job_id: string;
  email: string;
  full_name: string;
  phone?: string;
  location?: string;
  status: ApplicantStatus;
  resume: ResumeData | null;
  match_score?: number;
  match_percentage?: number;
  notes: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface ApplicantWithMatch extends Applicant {
  match_score: number;
  match_percentage: number;
  skill_match: SkillMatchBreakdown;
  missing_skills: string[];
}

export interface SkillMatchBreakdown {
  required_skills_matched: number;
  required_skills_total: number;
  nice_to_have_matched: number;
  nice_to_have_total: number;
  matched_skills: string[];
  missing_required_skills: string[];
  missing_nice_to_have_skills: string[];
}

export interface ApplicantFilter {
  status?: ApplicantStatus;
  min_score?: number;
  max_score?: number;
  search?: string;
  tags?: string[];
}

export interface CreateApplicantInput {
  job_id: string;
  email: string;
  full_name: string;
  phone?: string;
  location?: string;
  resume_file: File;
}

export interface UpdateApplicantInput {
  status?: ApplicantStatus;
  notes?: string;
  tags?: string[];
}
