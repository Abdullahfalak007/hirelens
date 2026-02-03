/**
 * Error handling utilities
 */

export class AppError extends Error {
  constructor(
    public message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: any,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, "VALIDATION_ERROR", 400, details);
    this.name = "ValidationError";
  }
}

export class AuthError extends AppError {
  constructor(message: string = "Authentication failed") {
    super(message, "AUTH_ERROR", 401);
    this.name = "AuthError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, "NOT_FOUND", 404);
    this.name = "NotFoundError";
  }
}

export class PermissionError extends AppError {
  constructor(message: string = "Permission denied") {
    super(message, "PERMISSION_ERROR", 403);
    this.name = "PermissionError";
  }
}

/**
 * Handle async errors in API routes
 */
export function handleApiError(error: any): {
  message: string;
  code: string;
  statusCode: number;
  details?: any;
} {
  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      details: error.details,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message || "Internal server error",
      code: "INTERNAL_ERROR",
      statusCode: 500,
    };
  }

  return {
    message: "Internal server error",
    code: "UNKNOWN_ERROR",
    statusCode: 500,
  };
}

/**
 * Handle Supabase errors
 */
export function handleSupabaseError(error: any) {
  if (!error) return null;

  const message = error.message || error.error_description || "Unknown error";
  const code = error.code || error.error || "SUPABASE_ERROR";

  if (code === "PGRST116") {
    return new NotFoundError("Resource");
  }

  if (code === "PGRST301") {
    return new PermissionError();
  }

  return new AppError(message, code, 500, error);
}
