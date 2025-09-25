// Integration: javascript_log_in_with_replit - Utility functions for authentication
export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*Unauthorized/.test(error.message);
}