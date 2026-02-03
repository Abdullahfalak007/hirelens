/**
 * AI matching and scoring types
 */

export interface MatchingRequest {
  resume_data: AIParsedResumeData;
  job_id: string;
  job_requirements: JobRequirementData;
}

export interface AIParsedResumeData {
  full_name?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  skills: string[];
  experience_years: number;
  experience_summary?: string;
  education?: string;
}

export interface JobRequirementData {
  title: string;
  description: string;
  required_skills: string[];
  nice_to_have_skills: string[];
  min_experience_years: number;
  max_experience_years?: number;
  required_education: string;
}

export interface MatchResult {
  match_score: number; // 0-100
  match_percentage: number; // 0-100
  skill_match: SkillMatchResult;
  experience_match: ExperienceMatchResult;
  education_match: EducationMatchResult;
  location_compatibility: number; // 0-100
  summary: string;
  strengths: string[];
  weaknesses: string[];
}

export interface SkillMatchResult {
  required_skills_matched: number;
  required_skills_total: number;
  nice_to_have_matched: number;
  nice_to_have_total: number;
  matched_skills: string[];
  missing_required_skills: string[];
  missing_nice_to_have_skills: string[];
  overall_score: number; // 0-100
}

export interface ExperienceMatchResult {
  years_of_experience: number;
  meets_minimum: boolean;
  meets_maximum?: boolean;
  score: number; // 0-100
}

export interface EducationMatchResult {
  required_level: string;
  candidate_level: string;
  matches: boolean;
  score: number; // 0-100
}

export interface BatchMatchingRequest {
  job_id: string;
  applicant_ids: string[];
}

export interface BatchMatchingResult {
  job_id: string;
  results: {
    applicant_id: string;
    match_result: MatchResult;
    completed_at: string;
  }[];
  processing_time_ms: number;
}

export interface AIProcessingJob {
  id: string;
  type: 'resume_parsing' | 'batch_matching' | 'ranking';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  input: any;
  result?: any;
  error?: string;
  created_at: string;
  completed_at?: string;
}
