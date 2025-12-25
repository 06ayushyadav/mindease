import AdminModel from "../../models/admin/admin.model";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password, role } = req.body;
  try {
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (role !== "admin") {
      return res.status(400).json({ message: "Role must be admin" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await AdminModel.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const token = jwt.sign(
      { email: admin.email, adminId: admin._id },
      process.env.JWT_SECRET as jwt.Secret,
      { expiresIn: "1d" }
    );

    res
      .cookie("token", token)
      .status(201)
      .json({
        message: "Admin registered successfully",
        data: {
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    const adminLogin = await AdminModel.findOne({ email });
    if (!adminLogin) {
      return res.status(401).json({
        success: false,
        message: "Incorrect Email or Password",
      });
    }

    const isMatched = await bcrypt.compare(password, adminLogin.password);
    if (!isMatched) {
      return res.status(401).json({
        success: false,
        message: "Incorrect Email or Password",
      });
    }

    const token = jwt.sign(
      { email: adminLogin.email },
      process.env.JWT_SECRET as jwt.Secret,
      { expiresIn: "1d" }
    );

    return res
      .cookie("token", token)
      .status(200)
      .json({
        success: true,
        message: `Welcome back 👋 ${adminLogin.name}`,
        token,
        admin: {
          _id: adminLogin._id,
          name: adminLogin.name,
          email: adminLogin.email,
          role: adminLogin.role,
        },
      });
  } catch (error) {
    console.log("Admin login", error);
    return res.status(400).json({ error: "Invalid credentials" });
  }
};




export const logoutAdmin = (req: Request, res: Response) => {
  try {
    // Clear HttpOnly token cookie
    res.clearCookie("token", {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production", // only https in production
      sameSite: "strict",
      path: "/",
    });

    // Optionally, return message
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Admin logout error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
