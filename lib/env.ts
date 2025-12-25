/**
 * Environment variable validation and type-safe access
 * This file validates all required environment variables at startup
 * 
 * NOTE: This file should only be imported in server-side code (API routes, server components)
 */

function getEnvVar(key: string, defaultValue?: string): string {
  // Type guard for Node.js environment
  if (typeof process === 'undefined' || !process.env) {
    throw new Error('process is not defined. This file should only run on the server.');
  }
  
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
      `Please add it to your .env.local file.\n` +
      `See .env.example for reference.`
    );
  }
  return value;
}

export const env = {
  // MongoDB
  MONGODB_URI: getEnvVar('MONGODB_URI'),
  
  // NextAuth
  NEXTAUTH_URL: getEnvVar('NEXTAUTH_URL', 'http://localhost:3000'),
  NEXTAUTH_SECRET: getEnvVar('NEXTAUTH_SECRET'),
  
  // Google OAuth
  GOOGLE_CLIENT_ID: getEnvVar('GOOGLE_CLIENT_ID'),
  GOOGLE_CLIENT_SECRET: getEnvVar('GOOGLE_CLIENT_SECRET'),
} as const;

