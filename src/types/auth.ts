/**
 * Authentication and user-related types
 */

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  organization_id: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: "admin" | "recruiter" | "viewer";
  created_at: string;
  updated_at: string;
}

export interface AuthSession {
  user: User | null;
  session: any | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  full_name: string;
  organization_name: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordReset {
  password: string;
  confirm_password: string;
}
