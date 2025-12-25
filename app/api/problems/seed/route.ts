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
        title: 'Longest Substring Without Repeating Characters',
        category: 'DSA',
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
        category: 'DSA',
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
        title: 'Palindrome Number',
        category: 'DSA',
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
      {
        title: 'Best Time to Buy and Sell Stock',
        category: 'DSA',
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
        category: 'DSA',
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
        category: 'DSA',
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
        category: 'DSA',
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
        title: 'Remove Duplicates from Sorted Array',
        category: 'DSA',
        description: `
          <p>Given an integer array <code>nums</code> sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. The relative order of the elements should be kept the same.</p>
          <p>Return <code>k</code> after placing the final result in the first <code>k</code> slots of <code>nums</code>.</p>
          <p><strong>Example:</strong></p>
          <pre>Input: nums = [1,1,2]
Output: 2, nums = [1,2,_]
Explanation: Your function should return k = 2, with the first two elements of nums being 1 and 2 respectively.</pre>
          <p><strong>Function signature:</strong></p>
          <pre>function solution(nums) {
  // Your code here
  return 0;
}</pre>
        `,
        difficulty: 'Easy',
        starterCode: `function solution(nums) {
  // Write your code here
  return 0;
}`,
        testCases: [
          { input: { nums: [1, 1, 2] }, expectedOutput: 2 },
          { input: { nums: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4] }, expectedOutput: 5 },
        ],
        xpReward: 50,
      },
      {
        title: 'Rotate Array',
        category: 'DSA',
        description: `
          <p>Given an integer array <code>nums</code>, rotate the array to the right by <code>k</code> steps, where <code>k</code> is non-negative.</p>
          <p><strong>Example:</strong></p>
          <pre>Input: nums = [1,2,3,4,5,6,7], k = 3
Output: [5,6,7,1,2,3,4]
Explanation:
rotate 1 steps to the right: [7,1,2,3,4,5,6]
rotate 2 steps to the right: [6,7,1,2,3,4,5]
rotate 3 steps to the right: [5,6,7,1,2,3,4]</pre>
          <p><strong>Function signature:</strong></p>
          <pre>function solution(nums, k) {
  // Your code here
  return nums;
}</pre>
        `,
        difficulty: 'Medium',
        starterCode: `function solution(nums, k) {
  // Write your code here
  return nums;
}`,
        testCases: [
          { input: { nums: [1, 2, 3, 4, 5, 6, 7], k: 3 }, expectedOutput: [5, 6, 7, 1, 2, 3, 4] },
          { input: { nums: [-1, -100, 3, 99], k: 2 }, expectedOutput: [3, 99, -1, -100] },
        ],
        xpReward: 100,
      },
      {
        title: 'Group Anagrams',
        category: 'DSA',
        description: `
          <p>Given an array of strings <code>strs</code>, group the anagrams together. You can return the answer in any order.</p>
          <p>An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.</p>
          <p><strong>Example:</strong></p>
          <pre>Input: strs = ["eat","tea","tan","ate","nat","bat"]
Output: [["bat"],["nat","tan"],["ate","eat","tea"]]</pre>
          <p><strong>Function signature:</strong></p>
          <pre>function solution(strs) {
  // Your code here
  return [];
}</pre>
        `,
        difficulty: 'Medium',
        starterCode: `function solution(strs) {
  // Write your code here
  return [];
}`,
        testCases: [
          { input: { strs: ['eat', 'tea', 'tan', 'ate', 'nat', 'bat'] }, expectedOutput: [['bat'], ['nat', 'tan'], ['ate', 'eat', 'tea']] },
          { input: { strs: [''] }, expectedOutput: [['']] },
        ],
        xpReward: 100,
      },
      {
        title: 'Product of Array Except Self',
        category: 'DSA',
        description: `
          <p>Given an integer array <code>nums</code>, return an array <code>answer</code> such that <code>answer[i]</code> is equal to the product of all the elements of <code>nums</code> except <code>nums[i]</code>.</p>
          <p>The product of any prefix or suffix of <code>nums</code> is guaranteed to fit in a 32-bit integer.</p>
          <p>You must write an algorithm that runs in O(n) time and without using the division operator.</p>
          <p><strong>Example:</strong></p>
          <pre>Input: nums = [1,2,3,4]
Output: [24,12,8,6]</pre>
          <p><strong>Function signature:</strong></p>
          <pre>function solution(nums) {
  // Your code here
  return [];
}</pre>
        `,
        difficulty: 'Medium',
        starterCode: `function solution(nums) {
  // Write your code here
  return [];
}`,
        testCases: [
          { input: { nums: [1, 2, 3, 4] }, expectedOutput: [24, 12, 8, 6] },
          { input: { nums: [-1, 1, 0, -3, 3] }, expectedOutput: [0, 0, 9, 0, 0] },
        ],
        xpReward: 100,
      },
      {
        title: 'Longest Consecutive Sequence',
        category: 'DSA',
        description: `
          <p>Given an unsorted array of integers <code>nums</code>, return the length of the longest consecutive elements sequence.</p>
          <p>You must write an algorithm that runs in O(n) time.</p>
          <p><strong>Example:</strong></p>
          <pre>Input: nums = [100,4,200,1,3,2]
Output: 4
Explanation: The longest consecutive elements sequence is [1, 2, 3, 4]. Therefore its length is 4.</pre>
          <p><strong>Function signature:</strong></p>
          <pre>function solution(nums) {
  // Your code here
  return 0;
}</pre>
        `,
        difficulty: 'Hard',
        starterCode: `function solution(nums) {
  // Write your code here
  return 0;
}`,
        testCases: [
          { input: { nums: [100, 4, 200, 1, 3, 2] }, expectedOutput: 4 },
          { input: { nums: [0, 3, 7, 2, 5, 8, 4, 6, 0, 1] }, expectedOutput: 9 },
        ],
        xpReward: 200,
      },
      {
        title: 'Word Break',
        category: 'DSA',
        description: `
          <p>Given a string <code>s</code> and a dictionary of strings <code>wordDict</code>, return <code>true</code> if <code>s</code> can be segmented into a space-separated sequence of one or more dictionary words.</p>
          <p><strong>Example:</strong></p>
          <pre>Input: s = "leetcode", wordDict = ["leet","code"]
Output: true
Explanation: Return true because "leetcode" can be segmented as "leet code".</pre>
          <p><strong>Function signature:</strong></p>
          <pre>function solution(s, wordDict) {
  // Your code here
  return false;
}</pre>
        `,
        difficulty: 'Medium',
        starterCode: `function solution(s, wordDict) {
  // Write your code here
  return false;
}`,
        testCases: [
          { input: { s: 'leetcode', wordDict: ['leet', 'code'] }, expectedOutput: true },
          { input: { s: 'applepenapple', wordDict: ['apple', 'pen'] }, expectedOutput: true },
          { input: { s: 'catsandog', wordDict: ['cats', 'dog', 'sand', 'and', 'cat'] }, expectedOutput: false },
        ],
        xpReward: 100,
      },
      // Web Dev Problems
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
      {
        title: 'Throttle Function',
        category: 'Web Dev',
        description: `
          <p>Implement a throttle function that limits how often a function can be called. The function should execute at most once per specified time interval.</p>
          <p><strong>Example:</strong></p>
          <pre>const throttledFn = solution(fn, delay);
// Multiple calls within delay period
// Only the first call executes immediately, others are ignored</pre>
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
          { input: { fn: (x) => x * 2, delay: 100, calls: [[1], [2], [3]] }, expectedOutput: [2] },
        ],
        xpReward: 100,
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
        title: 'URL Parser',
        category: 'Web Dev',
        description: `
          <p>Implement a function that parses a URL string and returns an object with the parsed components (protocol, host, path, query parameters, etc.).</p>
          <p><strong>Example:</strong></p>
          <pre>Input: url = "https://example.com/path?name=John&age=30"
Output: {
  protocol: "https",
  host: "example.com",
  path: "/path",
  query: { name: "John", age: "30" }
}</pre>
          <p><strong>Function signature:</strong></p>
          <pre>function solution(url) {
  // Your code here
  return {};
}</pre>
        `,
        difficulty: 'Medium',
        starterCode: `function solution(url) {
  // Write your code here
  return {};
}`,
        testCases: [
          { input: { url: 'https://example.com/path?name=John&age=30' }, expectedOutput: { protocol: 'https', host: 'example.com', path: '/path', query: { name: 'John', age: '30' } } },
        ],
        xpReward: 100,
      },
      {
        title: 'Event Emitter',
        category: 'Web Dev',
        description: `
          <p>Implement an EventEmitter class that supports subscribing to events, emitting events, and unsubscribing from events.</p>
          <p><strong>Example:</strong></p>
          <pre>const emitter = new EventEmitter();
emitter.on('click', (data) => console.log(data));
emitter.emit('click', 'button clicked');
emitter.off('click', handler);</pre>
          <p><strong>Function signature:</strong></p>
          <pre>class EventEmitter {
  constructor() {
    // Your code here
  }
  
  on(event, handler) {
    // Your code here
  }
  
  emit(event, data) {
    // Your code here
  }
  
  off(event, handler) {
    // Your code here
  }
}</pre>
        `,
        difficulty: 'Medium',
        starterCode: `class EventEmitter {
  constructor() {
    // Your code here
  }
  
  on(event, handler) {
    // Your code here
  }
  
  emit(event, data) {
    // Your code here
  }
  
  off(event, handler) {
    // Your code here
  }
}`,
        testCases: [
          { input: { events: [['on', 'click', (x) => x * 2], ['emit', 'click', 5], ['off', 'click']] }, expectedOutput: [10] },
        ],
        xpReward: 100,
      },
      {
        title: 'Promise All',
        category: 'Web Dev',
        description: `
          <p>Implement a function similar to Promise.all that takes an array of promises and returns a promise that resolves to an array of results when all promises resolve, or rejects if any promise rejects.</p>
          <p><strong>Example:</strong></p>
          <pre>const promises = [
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3)
];
solution(promises).then(results => console.log(results)); // [1, 2, 3]</pre>
          <p><strong>Function signature:</strong></p>
          <pre>function solution(promises) {
  // Your code here
  return Promise.resolve([]);
}</pre>
        `,
        difficulty: 'Medium',
        starterCode: `function solution(promises) {
  // Write your code here
  return Promise.resolve([]);
}`,
        testCases: [
          { input: { promises: [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)] }, expectedOutput: [1, 2, 3] },
        ],
        xpReward: 100,
      },
      {
        title: 'Memoization',
        category: 'Web Dev',
        description: `
          <p>Implement a memoization function that caches the results of function calls based on their arguments.</p>
          <p><strong>Example:</strong></p>
          <pre>const memoizedFn = solution((a, b) => a + b);
memoizedFn(1, 2); // Computes and caches result
memoizedFn(1, 2); // Returns cached result</pre>
          <p><strong>Function signature:</strong></p>
          <pre>function solution(fn) {
  // Your code here
  return function(...args) {
    // Implementation
  };
}</pre>
        `,
        difficulty: 'Medium',
        starterCode: `function solution(fn) {
  // Write your code here
  return function(...args) {
    // Implementation
  };
}`,
        testCases: [
          { input: { fn: (a, b) => a + b, calls: [[1, 2], [1, 2], [3, 4]] }, expectedOutput: [3, 3, 7] },
        ],
        xpReward: 100,
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
        title: 'Array Methods: Reduce',
        category: 'Web Dev',
        description: `
          <p>Implement your own version of the Array.reduce() method without using the built-in reduce function.</p>
          <p><strong>Example:</strong></p>
          <pre>const arr = [1, 2, 3, 4];
const result = solution(arr, (acc, x) => acc + x, 0);
// result should be 10</pre>
          <p><strong>Function signature:</strong></p>
          <pre>function solution(arr, callback, initialValue) {
  // Your code here
  return 0;
}</pre>
        `,
        difficulty: 'Medium',
        starterCode: `function solution(arr, callback, initialValue) {
  // Write your code here
  return 0;
}`,
        testCases: [
          { input: { arr: [1, 2, 3, 4], callback: (acc, x) => acc + x, initialValue: 0 }, expectedOutput: 10 },
          { input: { arr: [1, 2, 3], callback: (acc, x) => acc * x, initialValue: 1 }, expectedOutput: 6 },
        ],
        xpReward: 100,
      },
      {
        title: 'Curry Function',
        category: 'Web Dev',
        description: `
          <p>Implement a curry function that transforms a function with multiple arguments into a sequence of functions, each taking a single argument.</p>
          <p><strong>Example:</strong></p>
          <pre>const add = (a, b, c) => a + b + c;
const curriedAdd = solution(add);
curriedAdd(1)(2)(3); // 6
curriedAdd(1, 2)(3); // 6</pre>
          <p><strong>Function signature:</strong></p>
          <pre>function solution(fn) {
  // Your code here
  return function curried(...args) {
    // Implementation
  };
}</pre>
        `,
        difficulty: 'Hard',
        starterCode: `function solution(fn) {
  // Write your code here
  return function curried(...args) {
    // Implementation
  };
}`,
        testCases: [
          { input: { fn: (a, b, c) => a + b + c, calls: [[1], [2], [3]] }, expectedOutput: 6 },
        ],
        xpReward: 200,
      },
      {
        title: 'JSON Stringify',
        category: 'Web Dev',
        description: `
          <p>Implement your own version of JSON.stringify() that converts a JavaScript object to a JSON string.</p>
          <p>Handle objects, arrays, strings, numbers, booleans, null, and undefined.</p>
          <p><strong>Example:</strong></p>
          <pre>Input: obj = { name: "John", age: 30, hobbies: ["reading", "coding"] }
Output: '{"name":"John","age":30,"hobbies":["reading","coding"]}'</pre>
          <p><strong>Function signature:</strong></p>
          <pre>function solution(obj) {
  // Your code here
  return "";
}</pre>
        `,
        difficulty: 'Hard',
        starterCode: `function solution(obj) {
  // Write your code here
  return "";
}`,
        testCases: [
          { input: { obj: { name: 'John', age: 30 } }, expectedOutput: '{"name":"John","age":30}' },
          { input: { obj: [1, 2, 3] }, expectedOutput: '[1,2,3]' },
        ],
        xpReward: 200,
      },
      {
        title: 'Bind Function',
        category: 'Web Dev',
        description: `
          <p>Implement your own version of Function.prototype.bind() that creates a new function with a bound this context and optionally pre-filled arguments.</p>
          <p><strong>Example:</strong></p>
          <pre>const obj = { name: "John" };
function greet(greeting, punctuation) {
  return greeting + " " + this.name + punctuation;
}
const boundGreet = solution(greet, obj, "Hello");
boundGreet("!"); // "Hello John!"</pre>
          <p><strong>Function signature:</strong></p>
          <pre>function solution(fn, context, ...args) {
  // Your code here
  return function(...newArgs) {
    // Implementation
  };
}</pre>
        `,
        difficulty: 'Medium',
        starterCode: `function solution(fn, context, ...args) {
  // Write your code here
  return function(...newArgs) {
    // Implementation
  };
}`,
        testCases: [
          { input: { fn: function(greeting) { return greeting + ' ' + this.name; }, context: { name: 'John' }, args: ['Hello'], newArgs: ['!'] }, expectedOutput: 'Hello John!' },
        ],
        xpReward: 100,
      },
      {
        title: 'Pipe Function',
        category: 'Web Dev',
        description: `
          <p>Implement a pipe function that chains multiple functions together, passing the result of one function as the input to the next.</p>
          <p><strong>Example:</strong></p>
          <pre>const addOne = x => x + 1;
const multiplyByTwo = x => x * 2;
const pipeFn = solution(addOne, multiplyByTwo);
pipeFn(5); // (5 + 1) * 2 = 12</pre>
          <p><strong>Function signature:</strong></p>
          <pre>function solution(...fns) {
  // Your code here
  return function(value) {
    // Implementation
  };
}</pre>
        `,
        difficulty: 'Easy',
        starterCode: `function solution(...fns) {
  // Write your code here
  return function(value) {
    // Implementation
  };
}`,
        testCases: [
          { input: { fns: [(x) => x + 1, (x) => x * 2], value: 5 }, expectedOutput: 12 },
          { input: { fns: [(x) => x * 2, (x) => x - 1], value: 3 }, expectedOutput: 5 },
        ],
        xpReward: 50,
      },
      {
        title: 'LRU Cache',
        category: 'Web Dev',
        description: `
          <p>Implement an LRU (Least Recently Used) Cache with get and put operations. The cache should have a maximum capacity and evict the least recently used item when the capacity is exceeded.</p>
          <p><strong>Example:</strong></p>
          <pre>const cache = new LRUCache(2);
cache.put(1, 1);
cache.put(2, 2);
cache.get(1); // returns 1
cache.put(3, 3); // evicts key 2
cache.get(2); // returns -1 (not found)</pre>
          <p><strong>Function signature:</strong></p>
          <pre>class LRUCache {
  constructor(capacity) {
    // Your code here
  }
  
  get(key) {
    // Your code here
    return -1;
  }
  
  put(key, value) {
    // Your code here
  }
}</pre>
        `,
        difficulty: 'Hard',
        starterCode: `class LRUCache {
  constructor(capacity) {
    // Your code here
  }
  
  get(key) {
    // Your code here
    return -1;
  }
  
  put(key, value) {
    // Your code here
  }
}`,
        testCases: [
          { input: { capacity: 2, operations: [['put', 1, 1], ['put', 2, 2], ['get', 1], ['put', 3, 3], ['get', 2]] }, expectedOutput: [1, -1] },
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

    return NextResponse.json({ message: 'Problems seeded successfully', count: sampleProblems.length });
  } catch (error: any) {
    console.error('Error seeding problems:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
