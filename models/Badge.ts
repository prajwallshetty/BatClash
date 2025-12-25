import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBadge extends Document {
  name: string;
  description: string;
  icon: string;
  condition: string; // e.g., "first_problem", "streak_7", "solved_50", "top_10"
  createdAt: Date;
}

const BadgeSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    condition: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const Badge: Model<IBadge> = mongoose.models.Badge || mongoose.model<IBadge>('Badge', BadgeSchema);

export default Badge;


