import mongoose, { Schema, Document, Model } from 'mongoose';
import { Types } from 'mongoose';

export interface ISubmission extends Document {
  userId: Types.ObjectId;
  problemId: Types.ObjectId;
  code: string;
  status: 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Time Limit Exceeded';
  executionTime?: number;
  errorMessage?: string;
  passedTests: number;
  totalTests: number;
  createdAt: Date;
}

const SubmissionSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    problemId: {
      type: Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Accepted', 'Wrong Answer', 'Runtime Error', 'Time Limit Exceeded'],
      required: true,
    },
    executionTime: {
      type: Number,
    },
    errorMessage: {
      type: String,
    },
    passedTests: {
      type: Number,
      required: true,
      min: 0,
    },
    totalTests: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Indexes for querying user submissions and problem submissions
SubmissionSchema.index({ userId: 1, createdAt: -1 });
SubmissionSchema.index({ problemId: 1, createdAt: -1 });
SubmissionSchema.index({ userId: 1, problemId: 1, status: 1 });

const Submission: Model<ISubmission> = mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);

export default Submission;


