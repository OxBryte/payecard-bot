// eslint-disable-next-line import/prefer-default-export

// Helper function for email validation for new users
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}