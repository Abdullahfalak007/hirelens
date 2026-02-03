/**
 * Database schema types (maps to Supabase tables)
 */

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          organization_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["users"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["users"]["Row"]>;
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          logo_url: string | null;
          owner_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["organizations"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["organizations"]["Row"]>;
      };
      jobs: {
        Row: {
          id: string;
          organization_id: string;
          title: string;
          description: string;
          requirements: string | null;
          status: "open" | "closed" | "paused" | "draft";
          min_experience_years: number;
          max_experience_years: number | null;
          experience_level: "entry" | "mid" | "senior" | "lead" | "executive";
          required_education: "high_school" | "bachelors" | "masters" | "phd";
          salary_min: number | null;
          salary_max: number | null;
          location: string;
          is_remote: boolean;
          created_by: string;
          created_at: string;
          updated_at: string;
          archived_at: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["jobs"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["jobs"]["Row"]>;
      };
      applicants: {
        Row: {
          id: string;
          job_id: string;
          email: string;
          full_name: string;
          phone: string | null;
          location: string | null;
          status:
            | "applied"
            | "shortlisted"
            | "interview"
            | "rejected"
            | "hired";
          match_score: number | null;
          notes: string | null;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["applicants"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["applicants"]["Row"]>;
      };
      resumes: {
        Row: {
          id: string;
          applicant_id: string;
          file_url: string;
          file_name: string;
          file_type: "pdf" | "docx" | "txt";
          file_size: number;
          raw_text: string | null;
          parsed_data: any; // JSON
          uploaded_at: string;
          processed_at: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["resumes"]["Row"],
          "id" | "uploaded_at"
        >;
        Update: Partial<Database["public"]["Tables"]["resumes"]["Row"]>;
      };
    };
  };
}
