import { Request, Response } from "express";
import CounselorBooking from "../../models/counselor/counselor-booking.model";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary"; 
import mongoose from "mongoose";


export const createBooking = async (req: Request, res: Response) => {
  try {
    const {
      name,
      bio,
      qualification,
      specialization,
      experience,
      fees,
      bookingTime,
      status,
    } = req.body;
    const counselorId = (req as any).Counselor?._id;

    if (!counselorId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: Counselor ID missing" });
    }

    const imageFile = (req.files as any)?.image?.[0];
    const certificateFile = (req.files as any)?.certificate?.[0];
    if (
      !name ||
      !bio ||
      !qualification ||
      !specialization ||
      !experience ||
      !fees ||
      !bookingTime ||
      !status ||
      !imageFile ||
      !certificateFile
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const imageUpload = await uploadToCloudinary(imageFile.path, "counselor_images");
    const certificateUpload = await uploadToCloudinary(
      certificateFile.path,
      "counselor_certificates"
    );

    const newBooking = await CounselorBooking.create({
      counselorId,
      name,
      bio,
      qualification,
      specialization,
      experience,
      fees,
      bookingTime,
      image: imageUpload,
      certificate: certificateUpload,
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Counselor profile created successfully",
      data: newBooking,
    });
  } catch (error: any) {
    console.error("Error in createBooking:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllCounselorsProfiles = async (req: Request, res: Response) => {
  try {
    const counselors = await CounselorBooking.find()
      .sort({ createdAt: -1 }) 
      .select(
        "name bio qualification specialization experience fees bookingTime image certificate status createdAt"
      )
      .populate("counselorId", "email")
      .lean();

    if (!counselors || counselors.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        message: "No counselor profiles found",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      count: counselors.length,
      data: counselors,
    });
  } catch (error: any) {
    console.error("Error fetching counselor profiles:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching counselor profiles",
      error: error.message,
    });
  }
};


export const getCounselorProfileById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Counselor ID format",
      });
    }

    const counselor = await CounselorBooking.findById(id)
      .select(
        "name bio qualification specialization experience fees bookingTime image certificate status createdAt"
      )
      .populate("counselorId", "email")
      .lean();

    if (!counselor) {
      return res.status(404).json({
        success: false,
        message: "Counselor profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: counselor,
    });
  } catch (error: any) {
    console.error("Error fetching single counselor profile:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching counselor profile",
      error: error.message,
    });
  }
};


export const updateMyBooking = async (req: Request, res: Response) => {
  const counselorId = (req as any).Counselor?._id;
  const { id } = req.params;

  try {
    if (!counselorId) {
      return res.status(401).json({ message: "Unauthorized: Counselor ID required" });
    }

    const updatedBooking = await CounselorBooking.findOneAndUpdate(
      { _id: id, counselorId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found or unauthorized" });
    }

    return res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: updatedBooking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteMyBooking = async (req: Request, res: Response) => {
  const counselorId = (req as any).Counselor?._id;
  const { id } = req.params;

  try {
    if (!counselorId) {
      return res.status(401).json({ message: "Unauthorized: Counselor ID required" });
    }

    const deletedBooking = await CounselorBooking.findOneAndDelete({
      _id: id,
      counselorId,
    });

    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found or unauthorized" });
    }

    return res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const updateStatus=async(req:Request,res:Response)=>{
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Approved", "Pending" , "Cancelled"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const updatedCounselor = await CounselorBooking.findByIdAndUpdate(
      id,
      { status },
      { new: true } 
    );

    if (!updatedCounselor) {
      return res.status(404).json({ success: false, message: "Counselor not found" });
    }

    return res.status(200).json({ success: true, data: updatedCounselor });
  } catch (error) {
    console.error("Error updating counselor status:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}