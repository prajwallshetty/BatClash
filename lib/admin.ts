/**
 * Admin utility functions for access control
 * Validates admin access based on ADMIN_EMAIL environment variable
 */

import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { env } from './env';
import { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';

/**
 * Check if the current user is an admin
 * @param email - User email from session
 * @returns true if user is admin, false otherwise
 */
export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.toLowerCase() === env.ADMIN_EMAIL.toLowerCase();
}

/**
 * Server-side admin check for API routes
 * Returns admin status and user email
 * Throws error if not admin
 */
export async function requireAdmin(request?: NextRequest) {
  const session = await getServerSession(request ? { req: request } : undefined, authOptions);
  
  if (!session?.user?.email) {
    throw new Error('Unauthorized: No active session');
  }
  
  if (!isAdmin(session.user.email)) {
    throw new Error('Forbidden: Admin access required');
  }
  
  return {
    email: session.user.email,
    userId: session.user.id,
  };
}


