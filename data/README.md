# Problem Data Structure

This folder contains all problem definitions organized by category and difficulty.

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

## JSON Schema

Each problem must follow this schema:

```json
{
  "slug": "unique-url-safe-identifier",
  "title": "Problem Title",
  "category": "DSA" | "Web Dev",
  "topic": "Array" | "String" | "Functions" | etc.,
  "difficulty": "Easy" | "Medium" | "Hard",
  "description": "<p>HTML formatted description</p>",
  "starterCode": "function solution(...) {\n  // Your code here\n}",
  "visibleTestCases": [
    {
      "input": { "param1": value1, "param2": value2 },
      "expectedOutput": expectedResult,
      "description": "Optional test case description"
    }
  ],
  "hiddenTestCases": [
    {
      "input": { "param1": value1 },
      "expectedOutput": expectedResult
    }
  ],
  "xpReward": 50 | 100 | 200
}
```

## Field Descriptions

- **slug**: Unique, URL-safe identifier (e.g., "two-sum", "deep-clone-object")
- **title**: Display name of the problem
- **category**: Either "DSA" or "Web Dev"
- **topic**: Problem topic/category (e.g., "Array", "Stack", "Functions")
- **difficulty**: "Easy" (50 XP), "Medium" (100 XP), or "Hard" (200 XP)
- **description**: HTML-formatted problem description with examples
- **starterCode**: JavaScript function template with `solution` function name
- **visibleTestCases**: Test cases shown to users (at least 1 required)
- **hiddenTestCases**: Test cases used for validation but not shown (optional)
- **xpReward**: XP points awarded (50 for Easy, 100 for Medium, 200 for Hard)

## Test Case Format

Test case `input` should be an object where keys match function parameter names:

```json
{
  "input": { "nums": [1, 2, 3], "target": 5 },
  "expectedOutput": [0, 2],
  "description": "Optional description"
}
```

This will call: `solution([1, 2, 3], 5)`

## Seeding

Run the seed script to load all problems:

```bash
npm run seed:problems
```

The script will:
- Load all JSON files from the data folder
- Validate problem structure
- Use MongoDB `bulkWrite` for efficient batch operations
- Use `slug` as unique identifier for upserts
- Preserve existing `solvedCount` values

