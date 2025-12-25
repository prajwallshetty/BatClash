# Project Structure

## Overview

This is a LeetCode-like solo coding platform built with Next.js 14, MongoDB, and NextAuth.

## Directory Structure

```
batman/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # NextAuth routes
│   │   ├── problems/             # Problem CRUD
│   │   ├── submit/               # Code submission & evaluation
│   │   ├── leaderboard/          # Leaderboard data
│   │   ├── badges/               # Badge initialization
│   │   ├── certificates/         # Certificate generation
│   │   └── profile/              # User profile data
│   ├── problems/                 # Problem pages
│   ├── leaderboard/              # Leaderboard page
│   ├── profile/                  # User profile page
│   ├── auth/                     # Authentication pages
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   └── Navbar.tsx               # Navigation bar
├── lib/                          # Utility libraries
│   ├── mongodb.ts                # MongoDB connection
│   ├── auth.ts                   # NextAuth configuration
│   ├── codeExecutor.ts          # Code execution engine
│   ├── certificate.ts            # PDF certificate generation
│   └── utils.ts                  # Utility functions
├── models/                       # Mongoose schemas
│   ├── User.ts                   # User model
│   ├── Problem.ts                # Problem model
│   ├── Submission.ts             # Submission model
│   ├── Badge.ts                  # Badge model
│   ├── UserBadge.ts             # User-Badge relationship
│   └── Certificate.ts           # Certificate model
├── types/                        # TypeScript type definitions
│   └── next-auth.d.ts           # NextAuth type extensions
├── public/                       # Static files
│   └── certificates/             # Generated PDF certificates
├── middleware.ts                 # Next.js middleware for auth
└── package.json                  # Dependencies

```

## Key Features Implementation

### 1. Authentication (NextAuth + Google OAuth)
- **File**: `lib/auth.ts`, `app/api/auth/[...nextauth]/route.ts`
- Auto-creates user profile on first login
- Stores user session with XP, rank, streak data

### 2. Problem Solving
- **Files**: 
  - `app/problems/page.tsx` - Problem list
  - `app/problems/[id]/page.tsx` - Individual problem with Monaco Editor
  - `app/api/submit/route.ts` - Submission handler
  - `lib/codeExecutor.ts` - Code execution engine
- Uses Monaco Editor for code editing
- Executes code in sandboxed VM with timeout
- Compares output against test cases

### 3. XP & Rank System
- **File**: `models/User.ts`
- XP rewards: Easy (50), Medium (100), Hard (200)
- Ranks: Bronze → Silver (500 XP) → Gold (2000 XP) → Diamond (5000 XP)
- Auto-updates on user save via Mongoose pre-save hook

### 4. Streak System
- **File**: `app/api/submit/route.ts`
- Tracks daily solving streak
- Resets if a day is missed
- Prevents multiple increments on same day

### 5. Badges & Achievements
- **Files**: 
  - `models/Badge.ts`, `models/UserBadge.ts`
  - `app/api/badges/init/route.ts` - Initialize default badges
  - `app/api/submit/route.ts` - Badge awarding logic
- Badges: First Problem, 7-Day Streak, 50 Problems Solved, Top 10

### 6. Certificates
- **Files**: 
  - `lib/certificate.ts` - PDF generation with Puppeteer
  - `app/api/certificates/generate/route.ts` - Certificate API
- Generates PDF certificates for milestones
- Stores in `public/certificates/`

### 7. Leaderboard
- **Files**: 
  - `app/api/leaderboard/route.ts` - Leaderboard API
  - `app/leaderboard/page.tsx` - Leaderboard UI
- Global leaderboard (sorted by total XP)
- Weekly leaderboard (sorted by weekly XP)
- Weekly XP reset via `/api/weekly-reset`

## Database Schema

### User
- email, name, image
- xp, weeklyXp, streak, solvedCount
- rank (Bronze/Silver/Gold/Diamond)
- lastSolvedDate

### Problem
- title, description, difficulty
- starterCode, testCases
- xpReward, solvedCount

### Submission
- userId, problemId, code
- status, executionTime, errorMessage
- passedTests, totalTests

### Badge
- name, description, icon, condition

### UserBadge
- userId, badgeId, earnedAt

### Certificate
- userId, certificateId, type, title, description
- pdfUrl, issuedAt

## API Endpoints

- `GET /api/problems` - List all problems
- `GET /api/problems/[id]` - Get problem details
- `POST /api/submit` - Submit code for evaluation
- `GET /api/leaderboard` - Get leaderboard (global/weekly)
- `GET /api/profile/badges` - Get user badges
- `POST /api/certificates/generate` - Generate certificate
- `POST /api/problems/seed` - Seed sample problems
- `POST /api/badges/init` - Initialize badges
- `POST /api/weekly-reset` - Reset weekly XP

## Code Execution Flow

1. User writes code in Monaco Editor
2. Code is submitted to `/api/submit`
3. `codeExecutor.ts` wraps code and executes in VM2 sandbox
4. Code runs against all test cases with timeout (5s)
5. Outputs are compared using deep equality
6. If accepted:
   - XP is awarded
   - Streak is updated
   - Badges are checked and awarded
   - Problem solved count increases

## Security Considerations

- Code execution in sandboxed VM2 environment
- Timeout protection (5 seconds)
- No file system or network access
- Authentication required for all problem-solving routes
- MongoDB injection protection via Mongoose


