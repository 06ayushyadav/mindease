import mongoose from "mongoose";

interface CounselorBookingDetails {
  counselorId: mongoose.Types.ObjectId;
  name: string;
  bio:string;
  qualification: string;
  specialization: string;
  experience: string;
  fees: number;
  bookingTime: string;
  image: string;
  certificate:string;
  status: "Cancelled"|"Approved" | "Pending" | "completed";
}

const CounselorBookingSchema = new mongoose.Schema<CounselorBookingDetails>(
  {
    counselorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Counselor",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    specialization: {
      // fixed
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    fees: {
      type: Number,
      required: true,
    },
    bookingTime: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    certificate:{
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Cancelled","Approved" , "Pending" , "completed"],
      default:"Pending",
    },
  },
  { timestamps: true }
);

const CounselorBooking = mongoose.model<CounselorBookingDetails>(
  "CounselorBooking",
  CounselorBookingSchema
);

export default CounselorBooking;
