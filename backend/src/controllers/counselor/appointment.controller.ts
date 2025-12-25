import { Request, Response } from "express";
import Appointment from "../../models/counselor/appointment.model";
import CounselorBooking from "../../models/counselor/counselor-booking.model";
import { sendEmailtoPatient } from "../../utils/sendEmaitoPatient";

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const { doctorId, patientName, patientEmail, date, problem } = req.body;
    const appointmentDate = new Date(date);

    if (
      !doctorId ||
      !patientName ||
      !patientEmail ||
      !appointmentDate ||
      !problem
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const roomId = Math.random().toString(36).substring(2, 10);

    const newAppointment = await Appointment.create({
      doctorId,
      patientName,
      patientEmail,
      date: appointmentDate,
      problem,
      roomId,
    });

    const formattedDate = appointmentDate.toLocaleString("en-In", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const emailHtml = `
     <h2>Hello ${patientEmail},</h2>
     <p>Your counseling session has been booked successfully!</p>
     <p><strong>Date & Time:</strong> ${formattedDate}</p>
     <p><strong>Room ID:</strong> ${roomId}</p>
    <p>You can join your session using this link:</p>
    <a href="http://localhost:5173/session/${roomId}" 
         style="color:#1a73e8;text-decoration:none;font-weight:bold; ">
         Join Video Call
      </a>
      <br/><br/>
      <p>– Team MindEase 💙</p>
    `;

    await sendEmailtoPatient(patientEmail,"Your MindEase Counseling Session",emailHtml)

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      data: newAppointment,
    });
  } catch (error: any) {
    console.error("Error creating appointment:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while creating appointment",
    });
  }
};

export const getDoctorAppointments = async (req: Request, res: Response) => {
  try {
    const counselorId = (req as any).Counselor?._id;
    const bookings = await CounselorBooking.find({ counselorId: counselorId });

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Counselor booking profile not found",
      });
    }
    const bookingIds = bookings.map((b) => b._id);
    const appointments = await Appointment.find({
      doctorId: { $in: bookingIds },
    });
    const formatted = appointments.map((app) => ({
      id: app._id,
      patientName: app.patientName,
      patientEmail: app.patientEmail,
      problem: app.problem,
      status: app.status,
      date: app.date,
      roomId:app.roomId
    }));

    res.status(200).json({
      success: true,
      total: formatted.length,
      data: formatted,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching counselor sessions",
    });
  }
};

export const getDoctorProfileById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Counselor ID is required in params.",
      });
    }

    const counselorProfile = await CounselorBooking.findOne({ counselorId: id });

    if (!counselorProfile) {
      return res.status(404).json({
        success: false,
        message: "Counselor profile not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: counselorProfile,
    });
  } catch (error: any) {
    console.error("Error fetching counselor profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching counselor profile.",
    });
  }
};

// appointment.controller.ts
export const updateAppointmentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating appointment", error });
  }
};
