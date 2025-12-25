
import { zodToMongoose } from "../utils/zodTOmongoose";
import { counselorRegisterSchema } from "../../../shared/schemas/counselor.schema";
import mongoose from "mongoose";

const fieldMeta = {
  email: { unique: true, index: true },
  createdAt: { default: Date.now() }
};

const mongooseSchemaDefinition = zodToMongoose(counselorRegisterSchema, fieldMeta) as any;

delete (mongooseSchemaDefinition as any).confirmPassword

const counselorSchema = new mongoose.Schema(mongooseSchemaDefinition);

export const Counselor = mongoose.model("Counselor", counselorSchema);

