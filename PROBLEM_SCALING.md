# Problem Scaling Guide

This document describes the scalable problem management system for Batclash.

## Overview

The platform now supports **1000+ problems** with a clean, maintainable structure using JSON files and efficient MongoDB bulk operations.

## Folder Structure

```
data/
├── dsa/
│   ├── easy.json
│   ├── medium.json
│   └── hard.json
└── web-dev/
    ├── easy.json
    ├── medium.json
    └── hard.json
```

## Problem Schema

Each problem in the JSON files must follow this structure:

```typescript
{
  slug: string;                    // Unique, URL-safe identifier
  title: string;                    // Display name
  category: "DSA" | "Web Dev";     // Problem category
  topic: string;                    // Topic (e.g., "Array", "Stack", "Functions")
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;              // HTML-formatted description
  starterCode: string;              // JavaScript function template
  visibleTestCases: TestCase[];    // Shown to users (min 1 required)
  hiddenTestCases: TestCase[];     // Used for validation (optional)
  xpReward: number;                // 50 (Easy), 100 (Medium), 200 (Hard)
}
```

## Database Model

The `Problem` model includes:
- **slug**: Unique identifier (indexed, unique)
- **topic**: Problem topic/category
- **visibleTestCases**: Test cases shown to users
- **hiddenTestCases**: Hidden validation test cases
- **Indexes**: Optimized for filtering by category, difficulty, and pagination

## Seeding Problems

### Command

```bash
npm run seed:problems
```

### How It Works

1. **Loads all JSON files** from `data/` folder structure
2. **Validates** problem structure and required fields
3. **Uses MongoDB `bulkWrite`** with upsert operations
4. **Uses `slug` as unique identifier** - existing problems are updated, new ones are inserted
5. **Preserves `solvedCount`** - only sets it to 0 for new problems
6. **Processes in batches** of 100 for optimal performance

### Example Output

```
🚀 Starting problem seeding...
✓ Connected to MongoDB
✓ Loaded 5 problems from dsa/easy.json
✓ Loaded 4 problems from dsa/medium.json
...
📦 Loaded 20 problems total
  Processed 20/20 problems...
✅ Seeding completed successfully!
   Total problems processed: 20
   New problems inserted: 15
   Existing problems updated: 5
```

## Adding New Problems

1. **Add to appropriate JSON file** in `data/{category}/{difficulty}.json`
2. **Follow the schema** - ensure all required fields are present
3. **Use unique slug** - slugs must be unique across all problems
4. **Run seed script** - `npm run seed:problems`

### Example Problem

```json
{
  "slug": "two-sum",
  "title": "Two Sum",
  "category": "DSA",
  "topic": "Array",
  "difficulty": "Easy",
  "description": "<p>Given an array of integers...</p>",
  "starterCode": "function solution(nums, target) {\n  // Your code here\n  return [];\n}",
  "visibleTestCases": [
    {
      "input": { "nums": [2, 7, 11, 15], "target": 9 },
      "expectedOutput": [0, 1],
      "description": "Basic example"
    }
  ],
  "hiddenTestCases": [
    {
      "input": { "nums": [3, 3], "target": 6 },
      "expectedOutput": [0, 1]
    }
  ],
  "xpReward": 50
}
```

## API Changes

### Problem List (`GET /api/problems`)
- Returns problems without test cases and starter code
- Supports filtering by `category` and `difficulty`
- Uses optimized indexes for fast queries

### Problem Detail (`GET /api/problems/[id]`)
- Returns problem with `visibleTestCases` only
- Hidden test cases are not exposed to the client
- Backward compatible: also returns `testCases` field

### Submission (`POST /api/submit`)
- Executes code against both `visibleTestCases` and `hiddenTestCases`
- All test cases must pass for acceptance

## Performance

- **Bulk operations**: Uses MongoDB `bulkWrite` for efficient batch processing
- **Indexes**: Optimized for category/difficulty filtering and pagination
- **Batch processing**: Processes 100 problems at a time
- **Upsert operations**: Updates existing problems, inserts new ones

## Scaling to 1000+ Problems

The system is designed to handle large-scale problem sets:

1. **JSON files**: Easy to manage and version control
2. **Bulk operations**: Efficient database writes
3. **Indexes**: Fast queries even with thousands of problems
4. **Modular structure**: Easy to split files if needed

### Tips for Large Datasets

- Keep JSON files under 10MB each (split if needed)
- Use consistent slug naming conventions
- Validate JSON before seeding
- Monitor database indexes for optimal performance

## Migration from Old System

The new system is backward compatible:
- Old problems without `slug` will need to be migrated
- `testCases` field is mapped to `visibleTestCases` for compatibility
- API routes handle both old and new schemas

## Maintenance

- **Regular seeding**: Run `npm run seed:problems` after adding problems
- **Validation**: Script validates all problems before seeding
- **Error handling**: Detailed error messages for invalid problems
- **Logging**: Clear output showing what was inserted/updated

