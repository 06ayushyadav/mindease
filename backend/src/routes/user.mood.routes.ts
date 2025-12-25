import { isAuthenticated } from "../middlewares/user/isAuthenticated";
import { createUserMood, deleteUserMood, readUserMood } from "../controllers/user.mood.controllers";
import { Router } from "express";

const router=Router();

router.post("/create-mood",isAuthenticated ,createUserMood);
router.get("/mood/:id",isAuthenticated, readUserMood);
router.delete("/mood/:id",isAuthenticated, deleteUserMood);

export default router;

