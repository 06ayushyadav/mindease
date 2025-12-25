import { isAuthenticated } from "../middlewares/counselor/isAuthenticated";
import {
  deleteCounselor,
  getCounselor,
  getCounselorById,
  getFile,
  getPhoto,
  loginCounselor,
  logoutCounselor,
  registerCounselor,
  updateCounselor,
  uploadFile,
  uploadProfilePhoto,
} from "../controllers/counselor.controllers";
import { Router } from "express";
import { upload } from "../middlewares/multer";

const router = Router();

router.post("/register", registerCounselor);

router.post("/login", loginCounselor);
router.post("/logout", logoutCounselor);
router.get("/dashboard/:counselorId", isAuthenticated, getCounselorById);
//
router.get("/all-counselors",getCounselor)
router.put("/dashboard/:counselorId", isAuthenticated, updateCounselor);
router.delete("/dashboard/:counselorId", isAuthenticated, deleteCounselor);

router.post(
  "/upload-certification",
  isAuthenticated,
  upload.single("file"),
  uploadFile
);
router.get("/:id/certificates", isAuthenticated, getFile);

router.post(
  "/upload-profile-photo",
  isAuthenticated,
  upload.single("file"),
  uploadProfilePhoto

);

router.get("/:id/profile-photo", isAuthenticated, getPhoto);

export default router;
