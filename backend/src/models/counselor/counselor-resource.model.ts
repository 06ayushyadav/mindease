import mongoose from "mongoose";


const ResourceSchema = new mongoose.Schema(
  {
    
    title: { type: String, required: true },
    description: { type: String },
    type: {
      type: String,
      enum: ["pdf", "article", "video", "image", "link", "other"],
      default: "other",
    },
    fileUrl: { type: String },
    fileKey: { type: String },
    externalUrl: { type: String },
    tags: [String],
    visibility: {
      type: String,
      enum: ["public", "private", "booked"],
      default: "public",
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Counselor",
      required: true,
    },
    sizeBytes: { type: Number },
    mimeType: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("CounselorResource", ResourceSchema);
