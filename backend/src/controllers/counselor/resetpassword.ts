import { NextFunction, Request, Response } from "express";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../../../../shared/schemas/reset/reset.schema";
import { Counselor } from "../../models/counselor.model";
import { generateToken, sha256 } from "../../utils/reset.util";
import { sendPasswordResetEmail } from "../../services/email.service";
import bcrypt from "bcrypt"


export const counselorForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = forgotPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.flatten() });
    }

    const { email } = parsed.data;
    const genericMsg = {
      message: "If this email exists, reset link has been sent.",
    };

    console.log()

    const counselor = await Counselor.findOne({ email });
    if (!counselor) {
      return res.json(genericMsg);
    }

    const raw = generateToken();
    const hash = sha256(raw);

    counselor.resetPasswordTokenHash = hash;
    counselor.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
    await counselor.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${raw}`;
    await sendPasswordResetEmail(counselor.email, resetUrl);

    return res.json(genericMsg);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const counselorResetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.flatten() });
    }

    const { token, newPassword } = parsed.data;
    const tokenHash = sha256(token);

    const counselor = await Counselor.findOne({
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpires: { $gt: new Date() },
    });
    if (!counselor) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword,10)

    counselor.password = hashedPassword;
    counselor.resetPasswordTokenHash = undefined;
    counselor.resetPasswordExpires = undefined;
    counselor.tokenVersion += 1;

    await counselor.save();

    return res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    next(error);
  }
};
