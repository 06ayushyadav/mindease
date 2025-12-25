import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import { userRegisterSchema } from "../../../shared/schemas/user.schema";
import { User } from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = userRegisterSchema.parse(req.body);
    const { confirmPassword, ...userData } = validatedData;

    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered. Please log in.",
      });
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = await User.create({
      ...userData,
      password: hashedPassword,
    });
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    const { password, ...userSafeData } = newUser.toObject();

    return res.status(201).json({
      success: true,
      message: "User registered successfully 🎉",
      token,
      user: userSafeData,
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
        errors: error.errors,
      });
    }
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Both email and password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Incorrect email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect email or password",
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, 
    });

    const { password: _password, ...userSafeData } = user.toObject();

    return res.status(200).json({
      success: true,
      message: `Welcome back 👋 ${user.userName}`,
      token,
      user: userSafeData,
    });
  } catch (error) {
    next(error);
  }
};



// get User By Id
export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });

  return res.status(200).json({ message: "Logged out successfully" });
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId=req.user?._id
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const { password, ...userSafeData } = user.toObject();
    res.json(userSafeData);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    next(error);
  }
};

// update user
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = userRegisterSchema.partial().parse(req.body);
    const updateUser = await User.findByIdAndUpdate(
      req.params.userId,
      { ...validatedData },
      { new: true }
    );
    await updateUser?.save();
    return res.json({
      success: true,
      message: "User Upated",
      updateUser,
    });
  } catch (error) {
    console.log("User not Updated : ", error);
    next(error);
  }
};

// delete user
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deleteUser = await User.findByIdAndDelete(req.params.userId);
    if (!deleteUser) return res.status(404).json({ error: "User not Found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.log("User not Deleted : ", error);
    next(error);
  }
};
