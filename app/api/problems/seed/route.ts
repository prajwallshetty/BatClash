import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Problem from '@/models/Problem';

/**
 * Seed sample problems into the database
 * Call this once to populate initial problems
 */
export async function POST() {
  try {
    await connectDB();

    const sampleProblems = [
      {
        title: 'Two Sum',
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
        title: 'Longest Substring Without Repeating Characters',
        description: `
          <p>Given a string <code>s</code>, find the length of the longest substring without repeating characters.</p>
          <p><strong>Example:</strong></p>
          <pre>Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.</pre>
          <p><strong>Function signature:</strong></p>
          <pre>function solution(s) {
  // Your code here
}</pre>
        `,
        difficulty: 'Medium',
        starterCode: `function solution(s) {
  // Write your code here
  return 0;
}`,
        testCases: [
          { input: { s: 'abcabcbb' }, expectedOutput: 3 },
          { input: { s: 'bbbbb' }, expectedOutput: 1 },
          { input: { s: 'pwwkew' }, expectedOutput: 3 },
        ],
        xpReward: 100,
      },
      {
        title: 'Merge Two Sorted Lists',
        description: `
          <p>You are given the heads of two sorted linked lists <code>list1</code> and <code>list2</code>.</p>
          <p>Merge the two lists in a one sorted list. The list should be made by splicing together the nodes of the first two lists.</p>
          <p>Return the head of the merged linked list.</p>
          <p><strong>Note:</strong> For this problem, linked lists are represented as arrays.</p>
          <p><strong>Example:</strong></p>
          <pre>Input: list1 = [1,2,4], list2 = [1,3,4]
Output: [1,1,2,3,4,4]</pre>
          <p><strong>Function signature:</strong></p>
          <pre>function solution(list1, list2) {
  // Your code here
}</pre>
        `,
        difficulty: 'Easy',
        starterCode: `function solution(list1, list2) {
  // Write your code here
  return [];
}`,
        testCases: [
          { input: { list1: [1, 2, 4], list2: [1, 3, 4] }, expectedOutput: [1, 1, 2, 3, 4, 4] },
          { input: { list1: [], list2: [] }, expectedOutput: [] },
          { input: { list1: [], list2: [0] }, expectedOutput: [0] },
        ],
        xpReward: 50,
      },
      {
        title: 'Valid Parentheses',
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
        title: 'Palindrome Number',
        description: `
          <p>Given an integer <code>x</code>, return <code>true</code> if <code>x</code> is a palindrome, and <code>false</code> otherwise.</p>
          <p><strong>Example:</strong></p>
          <pre>Input: x = 121
Output: true
Explanation: 121 reads as 121 from left to right and from right to left.</pre>
          <p><strong>Function signature:</strong></p>
          <pre>function solution(x) {
  // Your code here
}</pre>
        `,
        difficulty: 'Easy',
        starterCode: `function solution(x) {
  // Write your code here
  return false;
}`,
        testCases: [
          { input: { x: 121 }, expectedOutput: true },
          { input: { x: -121 }, expectedOutput: false },
          { input: { x: 10 }, expectedOutput: false },
        ],
        xpReward: 50,
      },
      {
        title: 'Maximum Subarray',
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
      {
        title: 'Best Time to Buy and Sell Stock',
        description: `
          <p>You are given an array <code>prices</code> where <code>prices[i]</code> is the price of a given stock on the <code>i</code>th day.</p>
          <p>You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.</p>
          <p>Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return <code>0</code>.</p>
          <p><strong>Example:</strong></p>
          <pre>Input: prices = [7,1,5,3,6,4]
Output: 5
Explanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.</pre>
          <p><strong>Function signature:</strong></p>
          <pre>function solution(prices) {
  // Your code here
}</pre>
        `,
        difficulty: 'Easy',
        starterCode: `function solution(prices) {
  // Write your code here
  return 0;
}`,
        testCases: [
          { input: { prices: [7, 1, 5, 3, 6, 4] }, expectedOutput: 5 },
          { input: { prices: [7, 6, 4, 3, 1] }, expectedOutput: 0 },
        ],
        xpReward: 50,
      },
      {
        title: 'Container With Most Water',
        description: `
          <p>You are given an integer array <code>height</code> of length <code>n</code>. There are <code>n</code> vertical lines drawn such that the two endpoints of the <code>i</code>th line are <code>(i, 0)</code> and <code>(i, height[i])</code>.</p>
          <p>Find two lines that together with the x-axis form a container, such that the container contains the most water.</p>
          <p>Return the maximum amount of water a container can store.</p>
          <p><strong>Example:</strong></p>
          <pre>Input: height = [1,8,6,2,5,4,8,3,7]
Output: 49</pre>
          <p><strong>Function signature:</strong></p>
          <pre>function solution(height) {
  // Your code here
}</pre>
        `,
        difficulty: 'Medium',
        starterCode: `function solution(height) {
  // Write your code here
  return 0;
}`,
        testCases: [
          { input: { height: [1, 8, 6, 2, 5, 4, 8, 3, 7] }, expectedOutput: 49 },
          { input: { height: [1, 1] }, expectedOutput: 1 },
        ],
        xpReward: 100,
      },
      {
        title: '3Sum',
        description: `
          <p>Given an integer array <code>nums</code>, return all the triplets <code>[nums[i], nums[j], nums[k]]</code> such that <code>i != j</code>, <code>i != k</code>, and <code>j != k</code>, and <code>nums[i] + nums[j] + nums[k] == 0</code>.</p>
          <p>Notice that the solution set must not contain duplicate triplets.</p>
          <p><strong>Example:</strong></p>
          <pre>Input: nums = [-1,0,1,2,-1,-4]
Output: [[-1,-1,2],[-1,0,1]]</pre>
          <p><strong>Function signature:</strong></p>
          <pre>function solution(nums) {
  // Your code here
}</pre>
        `,
        difficulty: 'Medium',
        starterCode: `function solution(nums) {
  // Write your code here
  return [];
}`,
        testCases: [
          { input: { nums: [-1, 0, 1, 2, -1, -4] }, expectedOutput: [[-1, -1, 2], [-1, 0, 1]] },
          { input: { nums: [0, 1, 1] }, expectedOutput: [] },
          { input: { nums: [0, 0, 0] }, expectedOutput: [[0, 0, 0]] },
        ],
        xpReward: 100,
      },
      {
        title: 'Trapping Rain Water',
        description: `
          <p>Given <code>n</code> non-negative integers representing an elevation map where the width of each bar is <code>1</code>, compute how much water it can trap after raining.</p>
          <p><strong>Example:</strong></p>
          <pre>Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6</pre>
          <p><strong>Function signature:</strong></p>
          <pre>function solution(height) {
  // Your code here
}</pre>
        `,
        difficulty: 'Hard',
        starterCode: `function solution(height) {
  // Write your code here
  return 0;
}`,
        testCases: [
          { input: { height: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1] }, expectedOutput: 6 },
          { input: { height: [4, 2, 0, 3, 2, 5] }, expectedOutput: 9 },
        ],
        xpReward: 200,
      },
    ];

    for (const problemData of sampleProblems) {
      await Problem.findOneAndUpdate(
        { title: problemData.title },
        problemData,
        { upsert: true, new: true }
      );
    }

    return NextResponse.json({ message: 'Problems seeded successfully' });
  } catch (error: any) {
    console.error('Error seeding problems:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

