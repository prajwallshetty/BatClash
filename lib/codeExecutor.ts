import { NodeVM } from 'vm2';
import { ITestCase } from '@/models/Problem';

export interface ExecutionResult {
  success: boolean;
  output?: any;
  error?: string;
  executionTime: number;
}

/**
 * Execute JavaScript code in a sandboxed environment with timeout
 * @param code - The JavaScript code to execute
 * @param testCase - The test case with input and expected output
 * @param timeout - Maximum execution time in milliseconds (default: 5000ms)
 */
export async function executeCode(
  code: string,
  testCase: ITestCase,
  timeout: number = 5000
): Promise<ExecutionResult> {
  const startTime = Date.now();

  try {
    // Create a VM instance with restricted access
    const vm = new NodeVM({
      timeout,
      sandbox: {},
      eval: false,
      wasm: false,
    });

    // Wrap the user code in a function and execute it
    // Test case input is an object with parameter names as keys
    // Extract values and pass as function arguments
    const inputObj = testCase.input;
    const inputKeys = Object.keys(inputObj);
    const inputValues = inputKeys.map(key => inputObj[key]);
    
    // Build function call with proper argument serialization
    const argsString = inputValues.map(val => JSON.stringify(val)).join(', ');
    
    const wrappedCode = `
      ${code}
      
      // Execute with test case input
      (function() {
        try {
          const result = solution(${argsString});
          return { success: true, output: result };
        } catch (error) {
          return { success: false, error: error.message || String(error) };
        }
      })();
    `;

    const result = vm.run(wrappedCode);
    const executionTime = Date.now() - startTime;

    if (result.success) {
      // Deep comparison of output
      const outputMatches = deepEqual(result.output, testCase.expectedOutput);
      
      return {
        success: outputMatches,
        output: result.output,
        executionTime,
        error: outputMatches ? undefined : 'Output does not match expected result',
      };
    } else {
      return {
        success: false,
        error: result.error || 'Runtime error occurred',
        executionTime,
      };
    }
  } catch (error: any) {
    const executionTime = Date.now() - startTime;
    
    if (error.message?.includes('Script execution timed out')) {
      return {
        success: false,
        error: 'Time Limit Exceeded',
        executionTime,
      };
    }
    
    return {
      success: false,
      error: error.message || 'Execution error',
      executionTime,
    };
  }
}

/**
 * Deep equality check for comparing outputs
 */
function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  
  if (a == null || b == null) return false;
  
  if (typeof a !== typeof b) return false;
  
  if (typeof a !== 'object') return a === b;
  
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }
  
  return true;
}

