# Setup Guide

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free tier works)
- Google Cloud Console account for OAuth

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up MongoDB Atlas

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier is fine)
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string and replace `<password>` with your database password

## Step 3: Set Up Google OAuth

1. Go to https://console.cloud.google.com/
2. Create a new project or select an existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure consent screen if prompted
6. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
7. Copy the Client ID and Client Secret

## Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Fill in your values:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL`: `http://localhost:3000` for development
   - `GOOGLE_CLIENT_ID`: From Google Cloud Console
   - `GOOGLE_CLIENT_SECRET`: From Google Cloud Console

## Step 5: Initialize Database

1. Start the development server:
```bash
npm run dev
```

2. In a new terminal, seed the database with problems:
```bash
curl -X POST http://localhost:3000/api/problems/seed
```

3. Initialize badges:
```bash
curl -X POST http://localhost:3000/api/badges/init
```

## Step 6: Run the Application

```bash
npm run dev
```

Visit http://localhost:3000 and sign in with Google!

## Weekly XP Reset

To reset weekly XP (should be automated via cron), call:
```bash
curl -X POST http://localhost:3000/api/weekly-reset
```

## Production Deployment

1. Update `NEXTAUTH_URL` to your production domain
2. Update Google OAuth redirect URI to your production domain
3. Set all environment variables in your hosting platform
4. Run database initialization scripts
5. Set up a weekly cron job for XP reset



