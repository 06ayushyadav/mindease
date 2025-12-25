
import express from "express";
import { getAdminAnalysis, getAdminStats } from "../../controllers/admin/admin-total.controller";

const router = express.Router();

router.get("/stats", getAdminStats);
router.get("/analysis", getAdminAnalysis);


export default router;
