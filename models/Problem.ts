import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITestCase {
  input: any;
  expectedOutput: any;
  description?: string;
}

export interface IProblem extends Document {
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  starterCode: string;
  testCases: ITestCase[];
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
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: true,
    },
    starterCode: {
      type: String,
      required: true,
    },
    testCases: {
      type: [TestCaseSchema],
      required: true,
      validate: {
        validator: (v: ITestCase[]) => v.length > 0,
        message: 'At least one test case is required',
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

// Indexes
ProblemSchema.index({ difficulty: 1 });
ProblemSchema.index({ createdAt: -1 });

const Problem: Model<IProblem> = mongoose.models.Problem || mongoose.model<IProblem>('Problem', ProblemSchema);

export default Problem;


