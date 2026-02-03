/**
 * Analytics and dashboard-related types
 */

export interface DashboardMetrics {
  total_jobs: number;
  open_jobs: number;
  total_applicants: number;
  avg_match_score: number;
  shortlist_rate: number;
  hire_rate: number;
}

export interface JobMetrics {
  job_id: string;
  total_applicants: number;
  shortlisted: number;
  rejected: number;
  hired: number;
  avg_match_score: number;
  match_score_distribution: MatchScoreDistribution[];
}

export interface MatchScoreDistribution {
  range: string; // e.g., '0-25', '25-50', '50-75', '75-100'
  count: number;
  percentage: number;
}

export interface SkillFrequency {
  skill: string;
  frequency: number;
  match_percentage: number;
  job_id?: string;
}

export interface HiringFunnel {
  applied: number;
  shortlisted: number;
  interviewed: number;
  rejected: number;
  hired: number;
  conversion_rates: {
    applied_to_shortlisted: number;
    shortlisted_to_interviewed: number;
    interviewed_to_hired: number;
  };
}

export interface UploadTrend {
  date: string;
  count: number;
}

export interface ApplicantTrendData {
  date: string;
  count: number;
  status: string;
}

export interface AnalyticsFilters {
  job_id?: string;
  date_range?: {
    start: string;
    end: string;
  };
  status?: string[];
}

export interface JobAnalytics {
  metrics: JobMetrics;
  hiring_funnel: HiringFunnel;
  top_skills: SkillFrequency[];
  upload_trends: UploadTrend[];
}
