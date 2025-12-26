import mongoose, { Schema, Document, Model } from 'mongoose';
import { Types } from 'mongoose';

export interface ICertificate extends Document {
  userId: Types.ObjectId;
  certificateId: string; // Unique certificate ID
  type: 'milestone' | 'rank' | 'streak' | 'achievement';
  title: string;
  description: string;
  pdfUrl: string;
  issuedAt: Date;
}

const CertificateSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    certificateId: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ['milestone', 'rank', 'streak', 'achievement'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    pdfUrl: {
      type: String,
      required: true,
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

// Indexes
CertificateSchema.index({ userId: 1, issuedAt: -1 });
CertificateSchema.index({ certificateId: 1 });

const Certificate: Model<ICertificate> = mongoose.models.Certificate || mongoose.model<ICertificate>('Certificate', CertificateSchema);

export default Certificate;



