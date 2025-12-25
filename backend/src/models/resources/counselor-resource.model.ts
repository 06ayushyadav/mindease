import mongoose from "mongoose";

type CounselorResource = {
  counselorId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  thumbnail?: string;
  url: string;
  category: string[];
};

const counselorResourceSchema = new mongoose.Schema<CounselorResource>(
  {
    counselorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Counselor",
      required: true,
    },
    
    title: { type: String, required: true },

    description: { type: String, required: true },

    thumbnail: {
      type: String,
    },

    url: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => /^https?:\/\/.+/.test(v),
        message: "Invalid URL format",
      },
    },

    category: { type: [String], required: true },
  },
  { timestamps: true }
);

counselorResourceSchema.index({ title: "text", category: 1 });

const CounselorResourceModel = mongoose.model<CounselorResource>(
  "CounselorResource",
  counselorResourceSchema
);

export default CounselorResourceModel;
