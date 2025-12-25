import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CounselorBooking",
    required: true,
  },
  patientName: { type: String, required: true },
  patientEmail: { type: String, required: true },
  date:{ type: Date, required: true },
  roomId: { type: String, required: true },
  problem: { type: String, required: true },
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
}, { timestamps: true });

export default mongoose.model("Appointment", AppointmentSchema);
