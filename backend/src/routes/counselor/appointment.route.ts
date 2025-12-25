import express from "express";
import { createAppointment, getDoctorAppointments, getDoctorProfileById, updateAppointmentStatus } from "../../controllers/counselor/appointment.controller";
import { isAuthenticated } from "../../middlewares/counselor/isAuthenticated";

const router = express.Router();

router.post("/book", createAppointment);
router.get("/my-appointments", isAuthenticated , getDoctorAppointments);
// router.get("/my-appointments/:id", isAuthenticated , getDoctorProfileById);
router.patch("/update/:id", updateAppointmentStatus);

export default router;
