import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/requestAuth";
import { userMoodCreateSchema } from "../../../shared/schemas/user/userMood";
import { UserMood } from "../models/usermood/user.moodtracker";
import { Types } from "mongoose";

// ceate
export const createUserMood = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const parse = userMoodCreateSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.format() });
  }
  try {
    const payload = parse.data;
    const userId = req.user?._id;
    const mood = new UserMood({
      ...payload,
      userId,
      createdAt: payload.createdAt ?? new Date(),
    });
    const saved = await mood.save();
    return res.status(201).json({
      success: true,
      message: "Mood created successfully",
      data: saved,
    });
  } catch (error) {
    console.error("createMood error", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// read
export const readUserMood = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized Access " });
    }

    const userMoods = await UserMood.find({ userId });
    if (!userMoods) {
      return res.status(404).json({ error: "Mood not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Mood Retrieved successfully",
      data: userMoods,
    });
  } catch (error) {
    next(error);
  }
};

// delete
export const deleteUserMood = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }
    const deletedMood = await UserMood.findByIdAndDelete({
      _id: id,
      userId: req.user!.id,
    }).lean();
    if (!deletedMood) {
      return res.status(404).json({ error: "Mood not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Mood deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
