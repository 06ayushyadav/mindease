import mongoose, { Document, Schema } from "mongoose";

interface AiChatbit extends Document {
  userId: mongoose.Types.ObjectId | null;
  sessionId: string;
  role: "user" | "counselor" | "assistant" | "system";
  content: string;
}

const aiChatbot = new Schema<AiChatbit>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    role: {
      type: String,
      enum: ["user", "counselor", "assistant", "system"],
      required: true,
    },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const AiChatbotModel = mongoose.model<AiChatbit>("AiChatbot", aiChatbot);
export default AiChatbotModel;