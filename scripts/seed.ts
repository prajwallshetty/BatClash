// Load environment variables FIRST using require (synchronous)
// This must happen before any imports that use env variables
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

// Directly import mongoose to avoid env.ts validation
import mongoose from 'mongoose';

// Import Problem model
import Problem from '../models/Problem';

// Connect to MongoDB directly
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

const sampleProblems = [
  // DSA Problems
  {
    title: 'Two Sum',
    category: 'DSA',
    description: `
      <p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.</p>
      <p>You may assume that each input would have exactly one solution, and you may not use the same element twice.</p>
      <p><strong>Example:</strong></p>
      <pre>Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].</pre>
      <p><strong>Function signature:</strong></p>
      <pre>function solution(nums, target) {
  // Your code here
}</pre>
    `,
    difficulty: 'Easy',
    starterCode: `function solution(nums, target) {
  // Write your code here
  return [];
}`,
    testCases: [
      { input: { nums: [2, 7, 11, 15], target: 9 }, expectedOutput: [0, 1] },
      { input: { nums: [3, 2, 4], target: 6 }, expectedOutput: [1, 2] },
      { input: { nums: [3, 3], target: 6 }, expectedOutput: [0, 1] },
    ],
    xpReward: 50,
  },
  {
    title: 'Reverse String',
    category: 'DSA',
    description: `
      <p>Write a function that reverses a string. The input string is given as an array of characters <code>s</code>.</p>
      <p>You must do this by modifying the input array in-place with O(1) extra memory.</p>
      <p><strong>Example:</strong></p>
      <pre>Input: s = ["h","e","l","l","o"]
Output: ["o","l","l","e","h"]</pre>
      <p><strong>Function signature:</strong></p>
      <pre>function solution(s) {
  // Your code here
}</pre>
    `,
    difficulty: 'Easy',
    starterCode: `function solution(s) {
  // Write your code here
  return s;
}`,
    testCases: [
      { input: { s: ['h', 'e', 'l', 'l', 'o'] }, expectedOutput: ['o', 'l', 'l', 'e', 'h'] },
      { input: { s: ['H', 'a', 'n', 'n', 'a', 'h'] }, expectedOutput: ['h', 'a', 'n', 'n', 'a', 'H'] },
    ],
    xpReward: 50,
  },
  {
    title: 'Valid Parentheses',
    category: 'DSA',
    description: `
      <p>Given a string <code>s</code> containing just the characters <code>'('</code>, <code>')'</code>, <code>'{'</code>, <code>'}'</code>, <code>'['</code> and <code>']'</code>, determine if the input string is valid.</p>
      <p>An input string is valid if:</p>
      <ul>
        <li>Open brackets must be closed by the same type of brackets.</li>
        <li>Open brackets must be closed in the correct order.</li>
        <li>Every close bracket has a corresponding open bracket of the same type.</li>
      </ul>
      <p><strong>Example:</strong></p>
      <pre>Input: s = "()"
Output: true</pre>
      <p><strong>Function signature:</strong></p>
      <pre>function solution(s) {
  // Your code here
}</pre>
    `,
    difficulty: 'Easy',
    starterCode: `function solution(s) {
  // Write your code here
  return false;
}`,
    testCases: [
      { input: { s: '()' }, expectedOutput: true },
      { input: { s: '()[]{}' }, expectedOutput: true },
      { input: { s: '(]' }, expectedOutput: false },
      { input: { s: '([)]' }, expectedOutput: false },
    ],
    xpReward: 50,
  },
  {
    title: 'Binary Search',
    category: 'DSA',
    description: `
      <p>Given an array of integers <code>nums</code> which is sorted in ascending order, and an integer <code>target</code>, write a function to search <code>target</code> in <code>nums</code>. If <code>target</code> exists, then return its index. Otherwise, return <code>-1</code>.</p>
      <p><strong>Example:</strong></p>
      <pre>Input: nums = [-1,0,3,5,9,12], target = 9
Output: 4
Explanation: 9 exists in nums and its index is 4</pre>
      <p><strong>Function signature:</strong></p>
      <pre>function solution(nums, target) {
  // Your code here
}</pre>
    `,
    difficulty: 'Easy',
    starterCode: `function solution(nums, target) {
  // Write your code here
  return -1;
}`,
    testCases: [
      { input: { nums: [-1, 0, 3, 5, 9, 12], target: 9 }, expectedOutput: 4 },
      { input: { nums: [-1, 0, 3, 5, 9, 12], target: 2 }, expectedOutput: -1 },
    ],
    xpReward: 50,
  },
  {
    title: 'Maximum Subarray',
    category: 'DSA',
    description: `
      <p>Given an integer array <code>nums</code>, find the subarray with the largest sum, and return its sum.</p>
      <p><strong>Example:</strong></p>
      <pre>Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: [4,-1,2,1] has the largest sum = 6.</pre>
      <p><strong>Function signature:</strong></p>
      <pre>function solution(nums) {
  // Your code here
}</pre>
    `,
    difficulty: 'Medium',
    starterCode: `function solution(nums) {
  // Write your code here
  return 0;
}`,
    testCases: [
      { input: { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] }, expectedOutput: 6 },
      { input: { nums: [1] }, expectedOutput: 1 },
      { input: { nums: [5, 4, -1, 7, 8] }, expectedOutput: 23 },
    ],
    xpReward: 100,
  },
  // Web Dev Problems
  {
    title: 'Flatten Nested Array',
    category: 'Web Dev',
    description: `
      <p>Given a multi-dimensional array, flatten it into a single-dimensional array.</p>
      <p><strong>Example:</strong></p>
      <pre>Input: arr = [1, [2, 3], [4, [5, 6]]]
Output: [1, 2, 3, 4, 5, 6]</pre>
      <p><strong>Function signature:</strong></p>
      <pre>function solution(arr) {
  // Your code here
  return [];
}</pre>
    `,
    difficulty: 'Easy',
    starterCode: `function solution(arr) {
  // Write your code here
  return [];
}`,
    testCases: [
      { input: { arr: [1, [2, 3], [4, [5, 6]]] }, expectedOutput: [1, 2, 3, 4, 5, 6] },
      { input: { arr: [[1, 2], [3, 4], [5]] }, expectedOutput: [1, 2, 3, 4, 5] },
    ],
    xpReward: 50,
  },
  {
    title: 'Array Methods: Map',
    category: 'Web Dev',
    description: `
      <p>Implement your own version of the Array.map() method without using the built-in map function.</p>
      <p><strong>Example:</strong></p>
      <pre>const arr = [1, 2, 3];
const result = solution(arr, (x) => x * 2);
// result should be [2, 4, 6]</pre>
      <p><strong>Function signature:</strong></p>
      <pre>function solution(arr, callback) {
  // Your code here
  return [];
}</pre>
    `,
    difficulty: 'Easy',
    starterCode: `function solution(arr, callback) {
  // Write your code here
  return [];
}`,
    testCases: [
      { input: { arr: [1, 2, 3], callback: (x) => x * 2 }, expectedOutput: [2, 4, 6] },
      { input: { arr: [1, 2, 3], callback: (x, i) => x + i }, expectedOutput: [1, 3, 5] },
    ],
    xpReward: 50,
  },
  {
    title: 'Array Methods: Filter',
    category: 'Web Dev',
    description: `
      <p>Implement your own version of the Array.filter() method without using the built-in filter function.</p>
      <p><strong>Example:</strong></p>
      <pre>const arr = [1, 2, 3, 4, 5];
const result = solution(arr, (x) => x % 2 === 0);
// result should be [2, 4]</pre>
      <p><strong>Function signature:</strong></p>
      <pre>function solution(arr, callback) {
  // Your code here
  return [];
}</pre>
    `,
    difficulty: 'Easy',
    starterCode: `function solution(arr, callback) {
  // Write your code here
  return [];
}`,
    testCases: [
      { input: { arr: [1, 2, 3, 4, 5], callback: (x) => x % 2 === 0 }, expectedOutput: [2, 4] },
      { input: { arr: [1, 2, 3, 4, 5], callback: (x) => x > 3 }, expectedOutput: [4, 5] },
    ],
    xpReward: 50,
  },
  {
    title: 'Deep Clone Object',
    category: 'Web Dev',
    description: `
      <p>Implement a function that creates a deep clone of a JavaScript object. The function should handle nested objects, arrays, and primitive values.</p>
      <p><strong>Example:</strong></p>
      <pre>Input: obj = { a: 1, b: { c: 2, d: [3, 4] } }
Output: { a: 1, b: { c: 2, d: [3, 4] } }
// The output should be a completely independent copy</pre>
      <p><strong>Function signature:</strong></p>
      <pre>function solution(obj) {
  // Your code here
  return {};
}</pre>
    `,
    difficulty: 'Medium',
    starterCode: `function solution(obj) {
  // Write your code here
  return {};
}`,
    testCases: [
      { input: { obj: { a: 1, b: { c: 2 } } }, expectedOutput: { a: 1, b: { c: 2 } } },
      { input: { obj: [1, [2, 3], { a: 4 }] }, expectedOutput: [1, [2, 3], { a: 4 }] },
    ],
    xpReward: 100,
  },
  {
    title: 'Debounce Function',
    category: 'Web Dev',
    description: `
      <p>Implement a debounce function that delays invoking a function until after a specified time has elapsed since it was last invoked.</p>
      <p>The debounced function should return a function that can be called multiple times, but will only execute the original function after the delay period has passed without any new calls.</p>
      <p><strong>Example:</strong></p>
      <pre>const debouncedFn = solution(fn, delay);
// Call debouncedFn multiple times
// Only the last call will execute after delay ms</pre>
      <p><strong>Function signature:</strong></p>
      <pre>function solution(fn, delay) {
  // Your code here
  return function(...args) {
    // Implementation
  };
}</pre>
    `,
    difficulty: 'Medium',
    starterCode: `function solution(fn, delay) {
  // Write your code here
  return function(...args) {
    // Implementation
  };
}`,
    testCases: [
      { input: { fn: (x) => x * 2, delay: 100, calls: [[1], [2], [3]] }, expectedOutput: [6] },
    ],
    xpReward: 100,
  },
];

async function seed() {
  try {
    await connectDB();
    console.log('Connected to database');

    for (const problemData of sampleProblems) {
      await Problem.findOneAndUpdate(
        { title: problemData.title },
        problemData,
        { upsert: true, new: true }
      );
      console.log(`Seeded: ${problemData.title}`);
    }

    console.log(`Successfully seeded ${sampleProblems.length} problems`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding problems:', error);
    process.exit(1);
  }
}

seed();

