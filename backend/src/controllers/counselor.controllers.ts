import { Request, Response, NextFunction } from "express";
import { counselorRegisterSchema } from "../../../shared/schemas/counselor.schema";
import { Counselor } from "../models/counselor.model";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import CounselorFile from "../models/counselor/counselor-file.model";


// Register
export const registerCounselor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = counselorRegisterSchema.parse(req.body);

    const existingCounselor = await Counselor.findOne({
      email: validatedData.email,
    });
    if (existingCounselor) {
      return res.status(400).json({ error: "Email Already Exists" });
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const newCounselor = await Counselor.create({
      ...validatedData,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { email: newCounselor.email, counselorId: newCounselor._id },
      process.env.JWT_SECRET as jwt.Secret,
      { expiresIn: "1d" }
    );

    return res.cookie("token", token).status(201).json({
      message: "Counselor Registered Successfully",
      data: newCounselor,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error });
    }
    next(error);
  }
};


// login
export const loginCounselor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Required",
      });
    }

    const loginCounselor = await Counselor.findOne({ email });
    if (!loginCounselor) {
      return res.status(401).json({
        success: false,
        message: "Incorrect Email or Password",
      });
    }

    const isMatched = await bcrypt.compare(password, loginCounselor.password);
    if (!isMatched) {
      return res.status(401).json({
        success: false,
        message: "Incorrect Email or Password",
      });
    }

    const token = jwt.sign(
      { email: loginCounselor.email, counselorId: loginCounselor._id },
      process.env.JWT_SECRET as jwt.Secret,
      { expiresIn: "1d" }
    );

    return res
      .cookie("token", token)
      .status(200)
      .json({
        success: true,
        message: `Welcome back 👋 ${
          loginCounselor.firstName + " " + loginCounselor.lastName
        }`,
        token,
        counselor: {
          _id: loginCounselor._id,
          firstName: loginCounselor.firstName,
          middleName: loginCounselor.middleName,
          lastName: loginCounselor.lastName,
          email: loginCounselor.email,
          age: loginCounselor.age,
          gender: loginCounselor.gender,
        },
      });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error });
    }
    next(error);
  }
};

// logout
export const logoutCounselor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.cookie("token", "", {
      expires: new Date(0),
      path: "/", 
    });

    res.status(200).json({
      success: true,
      message: "Logged Out Successfully",
    });
  } catch (error) {
    next(error);
  }
};

//getCounselorBy Id
export const getCounselorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const counselor = await Counselor.findById(req.params.counselorId);
    if (!counselor)
      return res.status(404).json({ error: "Counselor not Found" });
    res.json({ success: true, data: counselor });
  } catch (error) {
    console.log("Counselor not Found : ", error);
    next(error);
  }
};

// get all counselor
export const getCounselor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const counselors = await Counselor.find();

    if (!counselors || counselors.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No counselors found",
      });
    }
    
    return res.status(200).json({
      success: true,
      count: counselors.length,
      data: counselors,
    });
    
  } catch (error: any) {
    console.error("Error fetching counselors:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching counselors",
      error: error.message,
    });
  }
};


export const updateCounselor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const validatedData = counselorRegisterSchema.partial().parse(req.body);

    const { confirmPassword, password, ...dataToUpdate } = validatedData;

    if (password) {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    const updatedCounselor = await Counselor.findByIdAndUpdate(
      req.params.counselorId,
      dataToUpdate,
      { new: true } 
    );

    if (!updatedCounselor) {
      return res
        .status(404)
        .json({ success: false, message: "Counselor not found" });
    }

    const { password: _password, ...userData } = updatedCounselor.toObject();

    return res.json({
      success: true,
      message: "Counselor Updated",
      data: userData,
    });
  } catch (error) {
    console.error("Counselor not Updated:", error);
    next(error);
  }
};

// delete

export const deleteCounselor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deleteCounselor = await Counselor.findByIdAndDelete(
      req.params.counselorId
    );
    if (!deleteCounselor)
      return res.status(404).json({ error: "Counselor not Found" });
    res.json({ message: "Counselor deleted successfully" });
  } catch (error) {
    console.log("Counselor not Deleted : ", error);
    next(error);
  }
};

// upload certification file
export const uploadFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.Counselor?._id) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded!" });
    }

    const folder = "Counselor-Certifications";
    const fileUrl = await uploadToCloudinary(req.file.path, folder);

    const fileData = await CounselorFile.create({
      counselorId: req.Counselor?._id,
      certificate: fileUrl,
    });

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully!",
      data: fileData,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Something went wrong during upload.",
    });
  }
};

// get file
export const getFile = async (req: Request, res: Response) => {
  try {
    const counselorId = req.params.id; 
    if (!counselorId) {
      return res
        .status(400)
        .json({ success: false, message: "Counselor ID is required" });
    }


    const files = await CounselorFile.find({ counselorId });

    if (!files || files.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No certificates found" });
    }

    return res.status(200).json({
      success: true,
      data: files, 
    });
  } catch (error: any) {
    console.error("Get file error:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};

// profile photo
export const uploadProfilePhoto = async (req: Request, res: Response) => {
  try {
    if (!req.Counselor?._id) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded!" });
    }

    const folder = "Counselor-ProfilePhotos";
    const photoUrl = await uploadToCloudinary(req.file.path, folder);

    const updatedCounselor = await CounselorFile.create(
      req.Counselor?._id,
      { profilePhoto: photoUrl },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Profile photo uploaded successfully!",
      data: updatedCounselor,
    });
  } catch (error: any) {
    console.error("Profile photo upload error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Something went wrong during upload.",
    });
  }
};

// get photo
export const getPhoto = async (req: Request, res: Response) => {
  try {
    const counselorId = req.params.id;
    if (!counselorId) {
      return res
        .status(400)
        .json({ success: false, message: "Counselor ID is required" });
    }


    const counselor = await CounselorFile.findById({ counselorId });

    if (!counselor || counselor.profilePic) {
      return res
        .status(404)
        .json({ success: false, message: "No certificates found" });
    }

    return res.status(200).json({
      success: true,
      data: { profilePhoto: counselor.profilePic }, 
    });
  } catch (error: any) {
    console.error("Get file error:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};

