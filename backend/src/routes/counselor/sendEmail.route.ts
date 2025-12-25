import express from "express";
import { sendEmail, getEmailsByCounselor } from "../../controllers/counselor/sendEmail-to-patient.controller";
import { isAuthenticated } from "../../middlewares/counselor/isAuthenticated";

const router = express.Router();

router.post("/send",isAuthenticated, sendEmail);

router.get("/:id", getEmailsByCounselor);

export default router;
