import CounselorResourceModel from "../../models/counselor/counselor-resource.model";
import path from "path";
import fs from "fs";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";

export const uploadResource = async (req, res) => {
  try {
    const counselorId = req.Counselor?._id;
    const { title, description, type, externalUrl, tags, visibility } =
      req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const resourceData = {
      title,
      description,
      type:
        type ||
        (req.file
          ? req.file.mimeType.startWith("image")
            ? "image"
            : req.file.mimeType === "application/pdf"
            ? "pdf"
            : req.file.mimetype.startsWith("video")
            ? "video"
            : "other"
          : "other"),
      externalUrl,
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      visibility: visibility || "public",
      uploadedBy: counselorId,
    };

    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.path,
        "counselor_resources"
      );

      resourceData.fileUrl = result;
      resourceData.mimeType = req.file.mimetype;

      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }

    const resource = new CounselorResourceModel(resourceData);
    await resource.save();
    return res.status(201).json({ success: true, resource });
  } catch (error) {
    console.error("Upload Resource Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getUploadById = async (req, res) => {
  try {
    const counselorId = req.Counselor?._id;

    if (!counselorId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const resources = await CounselorResourceModel.find({ uploadedBy: counselorId })
      .sort({ createdAt: -1 }); 

    return res.status(200).json({
      success: true,
      count: resources.length,
      resources,
    });
  } catch (error) {
    console.error("Get My Uploads Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllUpload = async (req, res) => {
  try {
    const { visibility, type, uploadedBy } = req.query;
    const query = {};

    if (visibility) query.visibility = visibility;
    if (type) query.type = type;
    if (uploadedBy) query.uploadedBy = uploadedBy;

    const resources = await CounselorResourceModel.find(query)
      .populate("uploadedBy", "firstName lastName email") 
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: resources.length,
      resources,
    });
  } catch (error) {
    console.error("Get Resource Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getSingleUpload = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await CounselorResourceModel.findById(id).populate(
      "uploadedBy",
      "firstName lastName email"
    );

    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    res.status(200).json({ success: true, resource });
  } catch (error) {
    console.error("Get Single Resource Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteUpload = async (req, res) => {
  try {
    const {id} =req.params
    const counselorId=req.Counselor?._id 
    const resource = await CounselorResourceModel.findById(id);
    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    if (resource.uploadedBy.toString() !== counselorId.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to delete" });
    }

    if (resource.fileUrl && resource.fileUrl.startsWith("/uploads")) {
      const filePath = path.join(process.cwd(), resource.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await CounselorResourceModel.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ success: true, message: "Resource deleted successfully" });
  } catch (error) {
    console.error("Delete Resource Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// admin delete
export const deleteAdminUpload = async (req, res) => {
  try {
    const resource = await CounselorResourceModel.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }
    if (!req.admin || !req.admin._id) {
      return res.status(401).json({ message: "Unauthorized - Admin not found" });
    }
    await CounselorResourceModel.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Resource deleted successfully by admin" });
  } catch (error) {
    console.error("Delete Resource Error:", error);
    res.status(500).json({ message: "Server error while deleting resource" });
  }
};

