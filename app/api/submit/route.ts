import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Problem from '@/models/Problem';
import Submission from '@/models/Submission';
import User from '@/models/User';
import Badge from '@/models/Badge';
import UserBadge from '@/models/UserBadge';
import { executeCode } from '@/lib/codeExecutor';
import { startOfDay, differenceInDays, isSameDay } from 'date-fns';

/**
 * Submit code for a problem
 * Evaluates code against test cases and updates user stats
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { problemId, code } = await request.json();

    if (!problemId || !code) {
      return NextResponse.json(
        { error: 'Problem ID and code are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Fetch problem with test cases
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    // Execute code against all test cases
    let passedTests = 0;
    let totalExecutionTime = 0;
    let errorMessage: string | undefined;
    let status: 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Time Limit Exceeded' = 'Accepted';

    for (const testCase of problem.testCases) {
      const result = await executeCode(code, testCase, 5000);
      totalExecutionTime += result.executionTime;

      if (!result.success) {
        if (result.error === 'Time Limit Exceeded') {
          status = 'Time Limit Exceeded';
        } else if (result.error && !result.error.includes('Output does not match')) {
          status = 'Runtime Error';
          errorMessage = result.error;
        } else {
          status = 'Wrong Answer';
        }
        break;
      } else {
        passedTests++;
      }
    }

    const isAccepted = status === 'Accepted' && passedTests === problem.testCases.length;

    // Save submission
    const submission = await Submission.create({
      userId: session.user.id,
      problemId: problem._id,
      code,
      status,
      executionTime: totalExecutionTime,
      errorMessage,
      passedTests,
      totalTests: problem.testCases.length,
    });

    // Update user stats if accepted
    if (isAccepted) {
      const user = await User.findById(session.user.id);
      if (user) {
        // Check if this is the first time solving this problem
        const previousAccepted = await Submission.findOne({
          userId: user._id,
          problemId: problem._id,
          status: 'Accepted',
          _id: { $ne: submission._id }, // Exclude current submission
        });

        // Only award XP if this is the first accepted submission for this problem
        if (!previousAccepted) {
          // Update XP
          user.xp += problem.xpReward;
          user.weeklyXp += problem.xpReward;
          user.solvedCount += 1;

          // Update streak
          const today = startOfDay(new Date());
          const lastSolved = user.lastSolvedDate ? startOfDay(user.lastSolvedDate) : null;

          if (!lastSolved || !isSameDay(today, lastSolved)) {
            if (lastSolved) {
              const daysDiff = differenceInDays(today, lastSolved);
              if (daysDiff === 1) {
                // Consecutive day
                user.streak += 1;
              } else if (daysDiff > 1) {
                // Streak broken
                user.streak = 1;
              }
            } else {
              // First problem solved
              user.streak = 1;
            }
            user.lastSolvedDate = new Date();
          }

          await user.save();

          // Check and award badges
          await checkAndAwardBadges(user._id.toString(), user);

          // Update problem solved count
          problem.solvedCount += 1;
          await problem.save();
        }
      }
    }

    return NextResponse.json({
      submission: {
        id: submission._id,
        status,
        passedTests,
        totalTests: problem.testCases.length,
        executionTime: totalExecutionTime,
        errorMessage,
      },
      isAccepted,
    });
  } catch (error: any) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Check and award badges based on user achievements
 */
async function checkAndAwardBadges(userId: string, user: any) {
  const badges = await Badge.find({});
  
  for (const badge of badges) {
    // Check if user already has this badge
    const hasBadge = await UserBadge.findOne({ userId, badgeId: badge._id });
    if (hasBadge) continue;

    let shouldAward = false;

    switch (badge.condition) {
      case 'first_problem':
        shouldAward = user.solvedCount >= 1;
        break;
      case 'streak_7':
        shouldAward = user.streak >= 7;
        break;
      case 'solved_50':
        shouldAward = user.solvedCount >= 50;
        break;
      case 'top_10':
        // Check if user is in top 10
        const topUsers = await User.find().sort({ xp: -1 }).limit(10);
        shouldAward = topUsers.some(u => u._id.toString() === userId);
        break;
    }

    if (shouldAward) {
      await UserBadge.create({
        userId,
        badgeId: badge._id,
      });
    }
  }
}

