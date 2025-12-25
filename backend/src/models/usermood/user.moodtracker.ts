import mongoose, { Schema, Document } from "mongoose";

export interface IMood extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  rating: number;
  tags: string[];
  note: string;
  context: { sleepHours: number; exerciseMinutes: number };
  createdAt: Date;
  updatedAt: Date;
}

const userMoodSchema = new Schema<IMood>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    rating: { type: Number, required: true, min: 1, max: 10 },
    tags: { type: [String], default: [] },
    note: { type: String },
    context: {
      sleepHours: { type: Number, required: true },
      exerciseMinutes: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

userMoodSchema.index({ createdAt: 1 });
userMoodSchema.index({ userId: 1, createdAt: -1 });

export const UserMood = mongoose.model<IMood>("userMood", userMoodSchema);
