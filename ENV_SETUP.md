# Environment Variables Setup

## Overview

All environment variables are now centralized in `lib/env.ts` for type-safe access and validation.

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/batman?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## How It Works

1. **Centralized Access**: All environment variables are accessed through `lib/env.ts`
   ```typescript
   import { env } from '@/lib/env';
   const mongoUri = env.MONGODB_URI;
   ```

2. **Validation**: Missing required variables will throw an error at startup with clear messages

3. **Type Safety**: TypeScript will catch any typos or missing variables at compile time

4. **Server-Only**: The env module should only be imported in server-side code (API routes, server components)

## Generating NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Or use an online generator: https://generate-secret.vercel.app/32

## Getting Google OAuth Credentials

1. Go to https://console.cloud.google.com/
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure consent screen
6. Add redirect URI: `http://localhost:3000/api/auth/callback/google`
7. Copy Client ID and Client Secret

## Getting MongoDB Atlas Connection String

1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user
4. Whitelist IP (0.0.0.0/0 for development)
5. Click "Connect" → "Connect your application"
6. Copy the connection string and replace `<password>` with your password

## Troubleshooting

### Error: "Missing required environment variable"
- Make sure `.env.local` exists in the root directory
- Check that all required variables are set
- Restart the development server after adding variables

### Error: "process is not defined"
- This means you're trying to use `env` in client-side code
- Only import `env` in API routes or server components
- Use Next.js environment variable prefixes for client-side: `NEXT_PUBLIC_*`


