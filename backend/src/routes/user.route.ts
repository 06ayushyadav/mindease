import { isAuthenticated } from "../middlewares/user/isAuthenticated";
import { deleteUser, getUserById, loginUser, logoutUser, registerUser, updateUser } from "../controllers/user.controllers";
import { Router } from "express";

const router=Router();

router.post("/register",registerUser);
router.post("/login",loginUser);

router.get("/:id",isAuthenticated,getUserById);

router.put("/user-update/:userId",isAuthenticated,updateUser);
router.delete("/delete-user/:userId",isAuthenticated,deleteUser);
router.post("/logout",isAuthenticated,logoutUser)

export default router


