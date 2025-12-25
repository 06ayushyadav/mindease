import { loginAdmin, logoutAdmin, registerAdmin } from "../../controllers/admin/admin.controller"
import Router from "express"

const router=Router()

router.post("/admin-register",registerAdmin)
router.post("/admin-login",loginAdmin)
router.post("/admin-logout",logoutAdmin)

export default router;