import { counselorForgotPassword, counselorResetPassword } from "../controllers/counselor/resetpassword";
import { forgotPassword, resetPassword } from "../controllers/resetpassword.controllers";
import { Router } from "express";


const router=Router();

router.post("/forgot-password",forgotPassword);
router.post("/reset-password",resetPassword);

// counselor
router.post("/counselor-forgot",counselorForgotPassword)
router.post("/counselor-reset",counselorResetPassword)


export default router  