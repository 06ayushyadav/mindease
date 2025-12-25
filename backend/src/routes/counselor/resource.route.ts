import express from 'express';
import {deleteAdminUpload, deleteUpload, getAllUpload, getSingleUpload, getUploadById, uploadResource} from "../../controllers/counselor/resource.controller"
import { isAuthenticated } from '../../middlewares/counselor/isAuthenticated';
import { upload } from '../../middlewares/multer';
import { isAdminAuthenticated } from '../../middlewares/admin/isAdminAuthenticated';

const router = express.Router();

router.post('/upload',isAuthenticated, upload.single('file'), uploadResource);
router.get('/get',getAllUpload)
router.get("/my",isAuthenticated, getUploadById);
router.get("/readmore/:id", getSingleUpload);
router.delete('/delete/:id',isAuthenticated,deleteUpload)
router.delete('/admin/delete/:id',isAdminAuthenticated, deleteAdminUpload)
export default router;
