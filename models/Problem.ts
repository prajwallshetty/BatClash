import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITestCase {
  input: any;
  expectedOutput: any;
  description?: string;
}

export interface IProblem extends Document {
  slug: string;
  title: string;
  description: string;
  category: 'Web Dev' | 'DSA';
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  starterCode: string;
  visibleTestCases: ITestCase[];
  hiddenTestCases: ITestCase[];
  xpReward: number;
  solvedCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const TestCaseSchema: Schema = new Schema({
  input: {
    type: Schema.Types.Mixed,
    required: true,
  },
  expectedOutput: {
    type: Schema.Types.Mixed,
    required: true,
  },
  description: {
    type: String,
  },
});

const ProblemSchema: Schema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Web Dev', 'DSA'],
      required: true,
      index: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: true,
      index: true,
    },
    starterCode: {
      type: String,
      required: true,
    },
    visibleTestCases: {
      type: [TestCaseSchema],
      required: true,
      validate: {
        validator: (v: ITestCase[]) => v.length > 0,
        message: 'At least one visible test case is required',
      },
    },
    hiddenTestCases: {
      type: [TestCaseSchema],
      required: true,
      default: [],
      validate: {
        validator: (v: ITestCase[]) => v.length >= 0,
        message: 'Hidden test cases must be an array',
      },
    },
    xpReward: {
      type: Number,
      required: true,
      min: 0,
    },
    solvedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying and pagination
// Note: slug uniqueness is already enforced by unique: true in schema definition
ProblemSchema.index({ category: 1, difficulty: 1 });
ProblemSchema.index({ category: 1, difficulty: 1, createdAt: -1 });
ProblemSchema.index({ difficulty: 1, createdAt: -1 });
ProblemSchema.index({ createdAt: -1 });

const Problem: Model<IProblem> = mongoose.models.Problem || mongoose.model<IProblem>('Problem', ProblemSchema);

export default Problem;


