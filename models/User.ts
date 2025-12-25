import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  password?: string; // For email/password auth
  image?: string;
  xp: number;
  weeklyXp: number;
  streak: number;
  lastSolvedDate?: Date;
  solvedCount: number;
  rank: 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      select: false, // Don't return password by default
    },
    image: {
      type: String,
    },
    xp: {
      type: Number,
      default: 0,
      min: 0,
    },
    weeklyXp: {
      type: Number,
      default: 0,
      min: 0,
    },
    streak: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastSolvedDate: {
      type: Date,
    },
    solvedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    rank: {
      type: String,
      enum: ['Bronze', 'Silver', 'Gold', 'Diamond'],
      default: 'Bronze',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
UserSchema.index({ xp: -1 });
UserSchema.index({ weeklyXp: -1 });
UserSchema.index({ email: 1 });

// Auto-update rank based on XP
UserSchema.pre('save', function (next) {
  const xp = this.xp;
  if (xp >= 5000) {
    this.rank = 'Diamond';
  } else if (xp >= 2000) {
    this.rank = 'Gold';
  } else if (xp >= 500) {
    this.rank = 'Silver';
  } else {
    this.rank = 'Bronze';
  }
  next();
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;

