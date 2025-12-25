import { Request, Response } from "express";
import CounselorResourceModel from "../../models/resources/counselor-resource.model";

export const postCounselorResource = async (req: Request, res: Response) => {
  const { title, description, thumbnail, url, category } = req.body;
  const counselorId = req.Counselor?._id;
  try {
    if (!counselorId) {
      return res.status(401).json({ message: "Unauthorized: No counselor ID" });
    }

    if (!title || !description || !url || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newResource = await CounselorResourceModel.create({
      counselorId,
      title,
      description,
      thumbnail,
      url,
      category,
    });

    return res.status(201).json({
      message: "Resource created successfully",
      resource: newResource,
    });
  } catch (error) {
    console.log("Counselor Resource Creation Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getCounselorResources = async (req: Request, res: Response) => {
  const counselorId = req.Counselor?._id;
  try {
    if (!counselorId) {
      return res.status(401).json({ message: "Unauthorized: No counselor ID" });
    }

    const resources = await CounselorResourceModel.find({ counselorId });
    return res.status(200).json(resources);
  } catch (error) {
    console.log("Error fetching resources:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const updateCounselorResource = async (req: Request, res: Response) => {
  const counselorId = req.Counselor?.id;
  const resourceId = req.params.id;
  const { title, description, thumbnail, url, category } = req.body;
  try {
    if (!counselorId || !resourceId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No counselor ID or resource ID" });
    }

    const updateResource = await CounselorResourceModel.findByIdAndUpdate(
      resourceId,
      {
        title,
        description,
        thumbnail,
        url,
        category,
      },
      { new: true }
    );
    if (!updateResource) {
      return res.status(404).json({
        message:
          "Resource not found or you do not have permission to update it",
      });
    }
    return res.status(200).json({
      message: "Resource updated successfully",
      resource: updateResource,
    });
  } catch (error) {
    console.log("Error updating resource:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const deleteCounselorResource = async (req: Request, res: Response) => {
  const counselorId = req.Counselor?._id;
  const resourceId = req.params.id;
  try {
    if (!counselorId) {
      return res.status(401).json({ message: "Unauthorized: No counselor ID" });
    }
    if (!resourceId) {
      return res.status(400).json({ message: "Resource ID is required" });
    }

    const resource = await CounselorResourceModel.findByIdAndDelete({
      _id: resourceId,
    });

    if (!resource) {
      return res.status(404).json({
        message:
          "Resource not found or you do not have permission to delete it",
      });
    }

    return res.status(200).json({ message: "Resource deleted successfully" });
  } catch (error) {
    console.log("Error deleting resource:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
