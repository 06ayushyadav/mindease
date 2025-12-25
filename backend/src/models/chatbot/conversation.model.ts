import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",             
    required: true, 
    index: true 
  },
  title: { type: String, default: "MindEase Chat" },
  meta: { type: Object, default: {} }
}, { timestamps: true, versionKey: false });

conversationSchema.index({ userId: 1, createdAt: -1 });


export const Conversation = mongoose.model("Conversation", conversationSchema);