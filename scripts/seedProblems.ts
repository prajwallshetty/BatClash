/**
 * Production-ready problem seeding script
 * 
 * This script:
 * - Loads all problem JSON files from data/ folder structure
 * - Uses MongoDB bulkWrite for efficient batch operations
 * - Uses slug as unique identifier for upsert operations
 * - Can handle 1000-5000+ problems efficiently
 */

// Load environment variables FIRST before any imports
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import Problem from '../models/Problem';

// Type definitions matching JSON schema
interface ProblemTestCase {
  input: any;
  expectedOutput: any;
  description?: string;
}

interface ProblemJSON {
  slug: string;
  title: string;
  category: 'Web Dev' | 'DSA';
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  starterCode: string;
  visibleTestCases: ProblemTestCase[];
  hiddenTestCases: ProblemTestCase[];
  xpReward: number;
}

// Connect to MongoDB
async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not set in .env.local');
  }
  
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }
  
  await mongoose.connect(MONGODB_URI);
  return mongoose;
}

/**
 * Load all problem JSON files from data folder structure
 * Structure: data/{category}/{difficulty}.json
 */
async function loadAllProblems(): Promise<ProblemJSON[]> {
  const dataDir = resolve(process.cwd(), 'data');
  const categories = ['dsa', 'web-dev'];
  const difficulties = ['easy', 'medium', 'hard'];
  const allProblems: ProblemJSON[] = [];

  for (const category of categories) {
    for (const difficulty of difficulties) {
      const filePath = join(dataDir, category, `${difficulty}.json`);
      
      try {
        const fileContent = await readFile(filePath, 'utf-8');
        const problems: ProblemJSON[] = JSON.parse(fileContent);
        
        // Validate and normalize category name
        const normalizedCategory = category === 'dsa' ? 'DSA' : 'Web Dev';
        
        // Add normalized category to each problem
        const normalizedProblems = problems.map(problem => ({
          ...problem,
          category: normalizedCategory as 'DSA' | 'Web Dev',
        }));
        
        allProblems.push(...normalizedProblems);
        console.log(`✓ Loaded ${normalizedProblems.length} problems from ${category}/${difficulty}.json`);
      } catch (error: any) {
        if (error.code === 'ENOENT') {
          console.warn(`⚠ File not found: ${filePath} (skipping)`);
        } else {
          console.error(`✗ Error loading ${filePath}:`, error.message);
        }
      }
    }
  }

  return allProblems;
}

/**
 * Seed problems using MongoDB bulkWrite for efficiency
 * Uses slug as unique identifier for upsert operations
 */
async function seedProblems() {
  try {
    console.log('🚀 Starting problem seeding...\n');
    
    // Connect to database
    await connectDB();
    console.log('✓ Connected to MongoDB\n');

    // Load all problems from JSON files
    const problems = await loadAllProblems();
    
    if (problems.length === 0) {
      console.log('⚠ No problems found to seed. Check your data/ folder structure.');
      process.exit(0);
    }

    console.log(`\n📦 Loaded ${problems.length} problems total\n`);

    // Validate all problems have required fields
    const invalidProblems = problems.filter(p => 
      !p.slug || !p.title || !p.category || !p.difficulty || !p.starterCode || 
      !p.visibleTestCases || p.visibleTestCases.length === 0
    );

    if (invalidProblems.length > 0) {
      console.error('✗ Found invalid problems:');
      invalidProblems.forEach(p => {
        console.error(`  - ${p.slug || 'NO_SLUG'}: Missing required fields`);
      });
      throw new Error('Invalid problem data detected');
    }

    // Prepare bulk write operations
    const bulkOps = problems.map(problem => ({
      updateOne: {
        filter: { slug: problem.slug },
        update: {
          $set: {
            slug: problem.slug,
            title: problem.title,
            category: problem.category,
            topic: problem.topic,
            difficulty: problem.difficulty,
            description: problem.description,
            starterCode: problem.starterCode,
            visibleTestCases: problem.visibleTestCases,
            hiddenTestCases: problem.hiddenTestCases || [],
            xpReward: problem.xpReward,
          },
          // Only set solvedCount when inserting new document (preserve existing value on update)
          $setOnInsert: {
            solvedCount: 0,
          },
        },
        upsert: true,
      },
    }));

    // Execute bulk write in batches for better performance
    const batchSize = 100;
    let totalProcessed = 0;
    let totalInserted = 0;
    let totalUpdated = 0;

    for (let i = 0; i < bulkOps.length; i += batchSize) {
      const batch = bulkOps.slice(i, i + batchSize);
      const result = await Problem.bulkWrite(batch, { ordered: false });
      
      totalProcessed += batch.length;
      totalInserted += result.upsertedCount;
      totalUpdated += result.modifiedCount;
      
      console.log(`  Processed ${totalProcessed}/${bulkOps.length} problems...`);
    }

    console.log('\n✅ Seeding completed successfully!');
    console.log(`   Total problems processed: ${totalProcessed}`);
    console.log(`   New problems inserted: ${totalInserted}`);
    console.log(`   Existing problems updated: ${totalUpdated}`);
    console.log(`   Problems unchanged: ${totalProcessed - totalInserted - totalUpdated}\n`);

    process.exit(0);
  } catch (error: any) {
    console.error('\n✗ Error seeding problems:', error.message);
    if (error.stack && process.env.NODE_ENV === 'development') {
      console.error('\nStack trace:', error.stack);
    }
    process.exit(1);
  }
}

// Run the seeding
seedProblems();

