'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Emoji } from 'react-apple-emojis';

interface TestCase {
  input: string;
  expectedOutput: string;
  description?: string;
}

export default function NewProblemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    category: 'DSA' as 'Web Dev' | 'DSA',
    topic: '',
    difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard',
    description: '',
    starterCode: '',
    xpReward: 50,
  });
  const [visibleTestCases, setVisibleTestCases] = useState<TestCase[]>([
    { input: '{}', expectedOutput: '', description: '' },
  ]);
  const [hiddenTestCases, setHiddenTestCases] = useState<TestCase[]>([
    { input: '{}', expectedOutput: '', description: '' },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Parse test cases
      const parsedVisible = visibleTestCases.map((tc) => ({
        input: JSON.parse(tc.input),
        expectedOutput: JSON.parse(tc.expectedOutput),
        description: tc.description || undefined,
      }));

      const parsedHidden = hiddenTestCases.map((tc) => ({
        input: JSON.parse(tc.input),
        expectedOutput: JSON.parse(tc.expectedOutput),
        description: tc.description || undefined,
      }));

      const res = await fetch('/api/admin/problems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          visibleTestCases: parsedVisible,
          hiddenTestCases: parsedHidden,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create problem');
      }

      router.push('/admin/problems');
    } catch (error: any) {
      alert(error.message || 'Failed to create problem');
      setLoading(false);
    }
  };

  const addTestCase = (type: 'visible' | 'hidden') => {
    const newCase = { input: '{}', expectedOutput: '', description: '' };
    if (type === 'visible') {
      setVisibleTestCases([...visibleTestCases, newCase]);
    } else {
      setHiddenTestCases([...hiddenTestCases, newCase]);
    }
  };

  const removeTestCase = (index: number, type: 'visible' | 'hidden') => {
    if (type === 'visible') {
      setVisibleTestCases(visibleTestCases.filter((_, i) => i !== index));
    } else {
      setHiddenTestCases(hiddenTestCases.filter((_, i) => i !== index));
    }
  };

  const updateTestCase = (index: number, field: keyof TestCase, value: string, type: 'visible' | 'hidden') => {
    if (type === 'visible') {
      const updated = [...visibleTestCases];
      updated[index] = { ...updated[index], [field]: value };
      setVisibleTestCases(updated);
    } else {
      const updated = [...hiddenTestCases];
      updated[index] = { ...updated[index], [field]: value };
      setHiddenTestCases(updated);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Create New Problem</h1>
        <p className="text-foreground/70">Add a new coding problem to the platform</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-2 border-foreground/10">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Problem identification and metadata</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="slug">Slug (URL-safe, unique)</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                required
                placeholder="two-sum"
              />
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Two Sum"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as 'Web Dev' | 'DSA' })}
                  className="w-full px-4 py-2 border-2 border-foreground/20 rounded-lg bg-background text-foreground"
                  required
                >
                  <option value="DSA">DSA</option>
                  <option value="Web Dev">Web Dev</option>
                </select>
              </div>
              <div>
                <Label htmlFor="difficulty">Difficulty</Label>
                <select
                  id="difficulty"
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard' })}
                  className="w-full px-4 py-2 border-2 border-foreground/20 rounded-lg bg-background text-foreground"
                  required
                >
                  <option value="Easy">Easy (50 XP)</option>
                  <option value="Medium">Medium (100 XP)</option>
                  <option value="Hard">Hard (200 XP)</option>
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                required
                placeholder="Array, Stack, Functions, etc."
              />
            </div>
            <div>
              <Label htmlFor="xpReward">XP Reward</Label>
              <Input
                id="xpReward"
                type="number"
                value={formData.xpReward}
                onChange={(e) => setFormData({ ...formData, xpReward: parseInt(e.target.value) || 0 })}
                required
                min="0"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-foreground/10">
          <CardHeader>
            <CardTitle>Description</CardTitle>
            <CardDescription>HTML-formatted problem description</CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={10}
              className="w-full px-4 py-2 border-2 border-foreground/20 rounded-lg bg-background text-foreground font-mono text-sm"
              placeholder="<p>Problem description with HTML formatting...</p>"
            />
          </CardContent>
        </Card>

        <Card className="border-2 border-foreground/10">
          <CardHeader>
            <CardTitle>Starter Code</CardTitle>
            <CardDescription>JavaScript function template</CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              value={formData.starterCode}
              onChange={(e) => setFormData({ ...formData, starterCode: e.target.value })}
              required
              rows={8}
              className="w-full px-4 py-2 border-2 border-foreground/20 rounded-lg bg-background text-foreground font-mono text-sm"
              placeholder="function solution(...) {&#10;  // Your code here&#10;}"
            />
          </CardContent>
        </Card>

        <Card className="border-2 border-foreground/10">
          <CardHeader>
            <CardTitle>Visible Test Cases</CardTitle>
            <CardDescription>Test cases shown to users</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {visibleTestCases.map((testCase, index) => (
              <div key={index} className="p-4 border-2 border-foreground/10 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Test Case {index + 1}</span>
                  {visibleTestCases.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeTestCase(index, 'visible')}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <div>
                  <Label>Input (JSON)</Label>
                  <textarea
                    value={testCase.input}
                    onChange={(e) => updateTestCase(index, 'input', e.target.value, 'visible')}
                    required
                    rows={2}
                    className="w-full px-4 py-2 border-2 border-foreground/20 rounded-lg bg-background text-foreground font-mono text-sm"
                    placeholder='{"nums": [1, 2, 3], "target": 5}'
                  />
                </div>
                <div>
                  <Label>Expected Output (JSON)</Label>
                  <textarea
                    value={testCase.expectedOutput}
                    onChange={(e) => updateTestCase(index, 'expectedOutput', e.target.value, 'visible')}
                    required
                    rows={2}
                    className="w-full px-4 py-2 border-2 border-foreground/20 rounded-lg bg-background text-foreground font-mono text-sm"
                    placeholder="[0, 1]"
                  />
                </div>
                <div>
                  <Label>Description (Optional)</Label>
                  <Input
                    value={testCase.description || ''}
                    onChange={(e) => updateTestCase(index, 'description', e.target.value, 'visible')}
                    placeholder="Test case description"
                  />
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => addTestCase('visible')}>
              <Emoji name="plus" className="w-4 h-4 mr-2" />
              Add Test Case
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-foreground/10">
          <CardHeader>
            <CardTitle>Hidden Test Cases</CardTitle>
            <CardDescription>Test cases used for validation (not shown to users)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {hiddenTestCases.map((testCase, index) => (
              <div key={index} className="p-4 border-2 border-foreground/10 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Hidden Test Case {index + 1}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeTestCase(index, 'hidden')}
                  >
                    Remove
                  </Button>
                </div>
                <div>
                  <Label>Input (JSON)</Label>
                  <textarea
                    value={testCase.input}
                    onChange={(e) => updateTestCase(index, 'input', e.target.value, 'hidden')}
                    required
                    rows={2}
                    className="w-full px-4 py-2 border-2 border-foreground/20 rounded-lg bg-background text-foreground font-mono text-sm"
                  />
                </div>
                <div>
                  <Label>Expected Output (JSON)</Label>
                  <textarea
                    value={testCase.expectedOutput}
                    onChange={(e) => updateTestCase(index, 'expectedOutput', e.target.value, 'hidden')}
                    required
                    rows={2}
                    className="w-full px-4 py-2 border-2 border-foreground/20 rounded-lg bg-background text-foreground font-mono text-sm"
                  />
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => addTestCase('hidden')}>
              <Emoji name="plus" className="w-4 h-4 mr-2" />
              Add Hidden Test Case
            </Button>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading} className="bg-foreground text-background hover:opacity-90">
            {loading ? 'Creating...' : 'Create Problem'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

