import mongoose, { Schema, Document } from "mongoose";
import { zodToMongoose } from "../utils/zodTOmongoose";
import { userRegisterSchema } from "../../../shared/schemas/user.schema";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  userName: string;
  email: string;
  password: string;
  age: number;
  gender: string;
  country: string;
  isAccepted: boolean;
  tokenVersion?: number;
  resetPasswordTokenHash?: string;
  resetPasswordExpires?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const fieldMeta = {
  email: { unique: true, index: true },
  createdAt: { default: Date.now },
};

const userSchema = zodToMongoose(userRegisterSchema, fieldMeta);

userSchema.add({
  resetPasswordTokenHash: { type: String, required: false },
  resetPasswordExpires: { type: Date, required: false },
  tokenVersion: { type: Number, default: 0 },
});


userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>("User", userSchema);

