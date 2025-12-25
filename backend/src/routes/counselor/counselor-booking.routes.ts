import express from "express";
import {
  createBooking,
  updateMyBooking,
  deleteMyBooking,
  getAllCounselorsProfiles,
  getCounselorProfileById,
  updateStatus,
} from "../../controllers/counselor/counselor-booking.controller";
import { isAuthenticated } from "../../middlewares/counselor/isAuthenticated";
import { upload } from "../../middlewares/multer";

const router = express.Router();

router.post(
  "/create-profile",
  isAuthenticated,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "certificate", maxCount: 1 },
  ]),
  createBooking
);
router.get("/profile",  getAllCounselorsProfiles);
router.get("/my-profile/:id",  getCounselorProfileById);
router.put("/profile/:id", updateMyBooking);
router.patch("/update-status/:id",updateStatus)
router.delete("/profile/:id", isAuthenticated, deleteMyBooking);

export default router;
