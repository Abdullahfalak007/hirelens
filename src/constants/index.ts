/**
 * Application constants
 * Non-sensitive, unchanging configuration values
 */

export const APP_NAME = "Hirelens";
export const APP_VERSION = "1.0.0";

/**
 * Pagination
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};

/**
 * File upload
 */
export const FILE_UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_RESUME_TYPES: [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ],
  ALLOWED_RESUME_EXTENSIONS: ["pdf", "docx", "txt"],
};

/**
 * Matching and scoring
 */
export const MATCHING = {
  MIN_MATCH_SCORE: 0,
  MAX_MATCH_SCORE: 100,
  EXCELLENT_MATCH_THRESHOLD: 80,
  GOOD_MATCH_THRESHOLD: 60,
  FAIR_MATCH_THRESHOLD: 40,
  POOR_MATCH_THRESHOLD: 0,

  // Weights for score calculation
  SKILL_WEIGHT: 0.4,
  EXPERIENCE_WEIGHT: 0.3,
  EDUCATION_WEIGHT: 0.2,
  LOCATION_WEIGHT: 0.1,
};

/**
 * Applicant status
 */
export const APPLICANT_STATUSES = [
  "applied",
  "shortlisted",
  "interview",
  "rejected",
  "hired",
] as const;

/**
 * Job status
 */
export const JOB_STATUSES = ["open", "closed", "paused", "draft"] as const;

/**
 * Experience levels
 */
export const EXPERIENCE_LEVELS = [
  "entry",
  "mid",
  "senior",
  "lead",
  "executive",
] as const;

/**
 * Education levels
 */
export const EDUCATION_LEVELS = [
  "high_school",
  "bachelors",
  "masters",
  "phd",
] as const;

/**
 * User roles
 */
export const USER_ROLES = ["admin", "recruiter", "viewer"] as const;

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  AUTH: "/api/auth",
  JOBS: "/api/jobs",
  APPLICANTS: "/api/applicants",
  RESUMES: "/api/resumes",
  MATCHING: "/api/matching",
  ANALYTICS: "/api/analytics",
  UPLOADS: "/api/uploads",
} as const;

/**
 * External service timeouts
 */
export const TIMEOUTS = {
  DEFAULT: 30000, // 30 seconds
  LONG_OPERATION: 120000, // 2 minutes
  RESUME_PROCESSING: 60000, // 1 minute
  MATCHING_JOB: 90000, // 1.5 minutes
} as const;
