import mongoose, { Schema, Document, Model } from 'mongoose';
import { Types } from 'mongoose';

export interface IUserBadge extends Document {
  userId: Types.ObjectId;
  badgeId: Types.ObjectId;
  earnedAt: Date;
}

const UserBadgeSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    badgeId: {
      type: Schema.Types.ObjectId,
      ref: 'Badge',
      required: true,
    },
    earnedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

// Ensure a user can only earn a badge once
UserBadgeSchema.index({ userId: 1, badgeId: 1 }, { unique: true });
UserBadgeSchema.index({ userId: 1, earnedAt: -1 });

const UserBadge: Model<IUserBadge> = mongoose.models.UserBadge || mongoose.model<IUserBadge>('UserBadge', UserBadgeSchema);

export default UserBadge;



